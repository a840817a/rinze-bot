export interface ApplicationCommand {
    id?: string;
    type?: ApplicationCommandType;
    application_id?: string;
    guild_id?: string;
    name: string;
    name_localizations?: { [key: string]: string };
    description: string;
    description_localizations?: { [key: string]: string };
    options?: ApplicationCommandOption[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    nsfw?: boolean;
    version?: string;
}

export enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

export interface ApplicationCommandOption {
    type?: ApplicationCommandOptionType;
    name: string;
    name_localizations?: { [key: string]: string };
    description: string;
    description_localizations?: { [key: string]: string };
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
    channel_types?: ChannelTypes[];
    min_value?: number;
    max_value?: number;
    min_length?: bigint;
    max_length?: bigint;
    autocomplete?: boolean;
}

export interface ApplicationCommandOptionChoice {
    name: string;
    name_localizations?: { [key: string]: string };
    value: string | bigint | number;
}

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
    GUILD_MEDIA = 16,
}