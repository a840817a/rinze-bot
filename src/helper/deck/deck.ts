import axios, {AxiosError} from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import cheerio from "cheerio";
import {storage as firebaseStorage} from "../firebase";
import {CardData, DeckData, DeckDownloadData, gameName, gamePath, imagePrefix} from "./structure";

sharp.cache(false);

const tempPath = 'temp';

const tempImageList = [
    'row0-deck-',
    'row1-deck-',
    'row2-deck-',
    'row3-deck-',
    'row4-deck-',
    'row0-subDeck-',
];

async function downloadDeckData(id: string) {
    let res = await axios.post('https://decklog.bushiroad.com/system/app/api/view/' + id, {},
        {"headers": {"Referer": "https://decklog.bushiroad.com/view/" + id}});

    return res.data as DeckData;
}

async function downloadCard(type: number, card: CardData, rotate = false, force: boolean = false) {
    const imageTempPath = path.resolve(tempPath, gamePath[type], card.card_number.replace('/', '_') + '.png');

    if (force || !fs.existsSync(imageTempPath)) {
        console.log('Downloading ' + gamePath[type] + ' card ' + card.name);
        try {
            let res = await axios.get(imagePrefix[type] + card.img, {responseType: 'arraybuffer'});
            let image = sharp(res.data);

            if (rotate && card.direction === 1) image.rotate(90);

            if (!fs.existsSync(path.dirname(imageTempPath))) {
                await fs.promises.mkdir(path.dirname(imageTempPath), {recursive: true});
            }
            return image.toFile(imageTempPath);
        } catch (e) {
            if (e instanceof AxiosError) {
                throw e.response?.data.error;
            }
            throw e;
        }
    } else {
        console.log('Already downloaded, skipping ' + gamePath[type] + ' card ' + card.name);
    }
}

async function downloadDeck(deck: CardData[], game_title_id: number, deckImageList: string[]) {
    for (let card of deck) {
        // console.log(card.card_kind + ' card ' + card.name + ' X ' + card.num);
        for (let i = 0; i < card.num; i++) deckImageList.push(path.resolve(tempPath, gamePath[game_title_id], card.card_number.replace('/', '_') + '.png'));
    }
    await Promise.all(deck.map(async (card) => {
        try {
            await downloadCard(game_title_id, card, true);
        } catch (e) {
            console.error(e);
        }
    }));
}

async function buildDeckImage(deckImageList: string[], out: string) {
    // console.log(deckImageList);
    for (let i = 1; i < deckImageList.length; i++) {
        let currentImage = path.resolve(tempPath, 'building/row' + Math.floor(i / 10) + '-' + out);
        if (i % 10 === 0) continue;
        if (i % 10 === 1) currentImage = deckImageList[i - 1];
        await joinImageHorizontal(
            currentImage,
            deckImageList[i],
            path.resolve(tempPath, 'building/row' + Math.floor(i / 10) + '-' + out),
            out
        );
    }
    await fs.promises.copyFile(path.resolve(tempPath, 'building/row0' + '-' + out), out, fs.constants.COPYFILE_FICLONE);
    for (let i = 1; i < deckImageList.length / 10; i++) {
        const currentImage = path.resolve(tempPath, 'building/row' + i + '-' + out);
        let perImage = out;
        if (i === 0) perImage = path.resolve(tempPath, 'building/row0' + '-' + out);
        await joinImageVertical(
            perImage,
            currentImage,
            out
        );
    }
}

async function joinImageHorizontal(left: string, right: string, out: string, id: string) {
    const l = path.resolve(tempPath, 'building/l-' + id);
    const r = path.resolve(tempPath, 'building/r-' + id);

    if (!fs.existsSync(path.dirname(l))) {
        await fs.promises.mkdir(path.dirname(l), {recursive: true});
    }

    await fs.promises.copyFile(left, l, fs.constants.COPYFILE_FICLONE);
    await fs.promises.copyFile(right, r, fs.constants.COPYFILE_FICLONE);

    const leftData = await sharp(l).metadata();
    const rightData = await sharp(r).metadata();

    await sharp({
        create: {
            width: leftData.width! + rightData.width!,
            height: Math.max(leftData.height!, rightData.height!),
            channels: 4,
            background: {r: 0, g: 0, b: 0, alpha: 0}
        }
    }).composite([{
        input: l,
        blend: 'add',
        top: 0,
        left: 0
    }, {
        input: r,
        blend: 'add',
        top: 0,
        left: leftData.width
    }]).toFile(out);

    await fs.promises.unlink(l);
    await fs.promises.unlink(r);

    // return img;
}

async function joinImageVertical(up: string, down: string, out: string) {
    const u = path.resolve(tempPath, 'building/u-' + out);
    const d = path.resolve(tempPath, 'building/d-' + out);

    if (!fs.existsSync(path.dirname(u))) {
        await fs.promises.mkdir(path.dirname(u), {recursive: true});
    }

    await fs.promises.copyFile(up, u, fs.constants.COPYFILE_FICLONE);
    await fs.promises.copyFile(down, d, fs.constants.COPYFILE_FICLONE);

    const upData = await sharp(u).metadata();
    const downData = await sharp(d).metadata();

    await sharp({
        create: {
            width: Math.max(upData.width!, downData.width!),
            height: upData.height! + downData.height!,
            channels: 4,
            background: {r: 0, g: 0, b: 0, alpha: 0}
        }
    }).composite([{
        input: u,
        blend: 'add',
        top: 0,
        left: 0
    }, {
        input: d,
        blend: 'add',
        top: upData.height,
        left: 0
    }]).toFile(out);

    await fs.promises.unlink(u);
    await fs.promises.unlink(d);

    // return img;
}

function deleteTemp(id: string) {
    for (let tempImage of tempImageList) {
        fs.unlink(path.resolve(tempPath, "building", tempImage + id + '.png'), () => {
        });
    }
    fs.unlink(path.resolve('deck-' + id + '.png'), () => {
    });
    fs.unlink(path.resolve('subDeck-' + id + '.png'), () => {
    });
}

export async function downloadDeckImage(id: string) {
    let data = await downloadDeckData(id);
    if (data.deck_id !== undefined) {
        let result:DeckDownloadData = {deckImageUrl: "", gameTitle: "", subDeckImageUrl: "", ...data};

        result.gameTitle = gameName[data.game_title_id];
        console.log('Found ' + result.gameTitle + ' deck ' + data.title);
        // console.log(data);
        console.log('Deck list :');
        let deckImageList: string[] = [];
        await downloadDeck(data.list, data.game_title_id, deckImageList);
        let subDeckImageList: string[] = [];
        if (data.sub_list.length > 0) {
            console.log('Sub deck list :');
            await downloadDeck(data.sub_list, data.game_title_id, subDeckImageList);
        }
        await buildDeckImage(deckImageList, 'deck-' + id.toUpperCase() + '.png');
        let deck = await firebaseStorage().upload('deck-' + id.toUpperCase() + '.png', {
            destination: 'deck/deck-' + id.toUpperCase() + '.png',
        });
        await deck[0].makePublic();
        result.deckImageUrl = deck[0].publicUrl();
        if (subDeckImageList.length > 0) {
            await buildDeckImage(subDeckImageList, 'subDeck-' + id.toUpperCase() + '.png');
            let subDeck = await firebaseStorage().upload('subDeck-' + id.toUpperCase() + '.png', {
                destination: 'deck/subDeck-' + id.toUpperCase() + '.png',
            });
            await subDeck[0].makePublic();
            result.subDeckImageUrl = subDeck[0].publicUrl();
        }
        deleteTemp(id.toUpperCase());
        return result;
        // await fs.unlinkSync(path.resolve(tempPath, 'building'));
    } else {
        throw 'Deck ' + id + ' not found!';
    }
}

export async function getWsCardDetail(id: string) {
    const res = await axios.get("https://ws-tcg.com/cardlist/?cardno=" + id);

    const page = cheerio.load(res.data);

    const cardDataTable = page('.card-detail-table tbody tr');

    let side = '';
    const sideImage = cardDataTable.eq(5).find('td').eq(0).find('img').eq(0).attr('src');

    if (sideImage === undefined) throw new Error("Cannot parse data!");
    else if (sideImage.endsWith('w.gif')) side = 'Weiß';
    else if (sideImage.endsWith('s.gif')) side = 'Schwarz';

    let cardType = '';
    const cardTypeRaw = cardDataTable.eq(5).find('td').eq(1).text();
    if (cardTypeRaw === 'キャラ') cardType = 'Character';
    else if (cardTypeRaw === 'イベント') cardType = 'Event';
    else if (cardTypeRaw === 'クライマックス') cardType = 'Climax';

    const colorImage = cardDataTable.eq(6).find('td').eq(0).find('img').eq(0).attr('src')?.split('/');
    if (colorImage === undefined) throw new Error("Cannot parse data!");

    let color = colorImage[colorImage.length - 1].split('.')[0];
    color = color.charAt(0).toUpperCase() + color.slice(1);

    const triggers = [];
    const triggerImage = cardDataTable.eq(8).find('td').eq(1).find('img');
    for (let i = 0; i < triggerImage.length; i++) {
        const img = triggerImage.eq(i).attr('src')?.split('/');
        if (img === undefined) throw new Error("Cannot parse data!");

        const trigger = img[img.length - 1].split('.')[0];
        triggers.push(trigger.charAt(0).toUpperCase() + trigger.slice(1));
    }

    let specialAttributes: string[] = [];
    const specialAttribute = cardDataTable.eq(9).find('td').eq(0).text();
    if (specialAttribute !== '-') specialAttributes = specialAttribute.split('・');

    cardDataTable.eq(10).find('td').eq(0).find('br').replaceWith('\n');
    cardDataTable.eq(11).find('td').eq(0).find('br').replaceWith('\n');

    return {
        'cardName': cardDataTable.eq(0).find('td').eq(1).contents().first().text(),
        'cardNameKana': cardDataTable.eq(0).find('.kana').text(),
        'cardNo': cardDataTable.eq(1).find('td').eq(0).text(),
        'image': 'https://ws-tcg.com' + page('.graphic').find('img').eq(0).attr('src'),
        'packName': cardDataTable.eq(2).find('td').eq(0).text(),
        'newStandardType': cardDataTable.eq(3).find('td').eq(0).text(),
        'seriesId': cardDataTable.eq(4).find('td').eq(0).text(),
        'rarity': cardDataTable.eq(4).find('td').eq(1).text(),
        'side': side,
        'cardType': cardType,
        'color': color,
        'level': cardDataTable.eq(6).find('td').eq(1).text() === '-' ? 0 : parseInt(cardDataTable.eq(6).find('td').eq(1).text(), 10),
        'cost': cardDataTable.eq(7).find('td').eq(0).text() === '-' ? 0 : parseInt(cardDataTable.eq(7).find('td').eq(0).text(), 10),
        'power': cardDataTable.eq(7).find('td').eq(1).text() === '-' ? 0 : parseInt(cardDataTable.eq(7).find('td').eq(1).text(), 10),
        'soul': cardDataTable.eq(8).find('td').eq(0).find('img').length,
        'trigger': triggers,
        'specialAttribute': specialAttributes,
        'text': cardDataTable.eq(10).find('td').eq(0).text().replace('（：', '（トリガー：'),
        'flavorText': cardDataTable.eq(11).find('td').eq(0).text() === '-' ? '' : cardDataTable.eq(11).find('td').eq(0).text(),
        'Illustrator': cardDataTable.eq(12).find('td').eq(0).text()
    };
}
