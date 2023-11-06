export interface DeckData {
    id: number
    deck_id?: string
    memo: string
    title: string
    comment: string
    game_title_id: number
    status: number
    fav_count: number
    deck_param1: string
    deck_param2: string
    list: CardData[]
    sub_list: any[]
    p_list: any[]
    owner: boolean
    regist_dist_flg: boolean
    dist_disp_flg: boolean
    has_recipe_error: number
    used: boolean
    can_edit: number
    s_list2: any
    fav: number
    is_publish: boolean
    can_fav: boolean
    publish_require: boolean
}

export interface DeckDownloadData extends DeckData {
    gameTitle: string
    deckImageUrl: string
    subDeckImageUrl: string
}

export interface CardData {
    card_number: string
    num: number
    _num: number
    type: number
    sub: any
    p_param: PParam
    width: number
    height: number
    direction: number
    id: number
    img: string
    card_kind: number
    rare: string
    name: string
    color: string
    cost: string
    level: string
    power: string
    max: number
    g_param: GParam
}

export interface PParam {
    p1: string
    p2: string
    p3: string
    p4: string
    p5: string
    p6: string
    p7: string
    p8: string
    p9: string
    p10: string
}

export interface GParam {
    g0: number
    g1: number
    g2: number
    g3: number
    g4: number
    g5: number
    g6: number
    g7: number
    g8: number
    g9: number
}

export const gameName = [
    '',
    'カードファイト!! ヴァンガード',
    'Weiß Schwarz',
    'フューチャーカード バディファイト',
    '',
    'Reバース for you'
];
export const gamePath = [
    '0',
    'Cardfight-Vanguard',
    'Weib-Schwarz',
    'Future-Card-Buddyfight',
    '4',
    'Rebirth-for-you'
];
export const imagePrefix = [
    '',
    'https://s3-ap-northeast-1.amazonaws.com/cf-vanguard.com/wordpress/wp-content/images/cardlist/',
    'https://ws-tcg.com/wordpress/wp-content/images/cardlist/',
    'https://fc-buddyfight.com/wordpress/wp-content/images/card/',
    '',
    'https://s3-ap-northeast-1.amazonaws.com/rebirth-fy.com/wordpress/wp-content/images/cardlist/'
];