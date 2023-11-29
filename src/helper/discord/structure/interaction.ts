export default interface Interaction {
    id : string;
    application_id : string;
    type: InteractionType;
    data?: ApplicationCommandData;
    guild_id?: string;
    channel?: any;
    channel_id?: string;
    member?: any;
    user?: any;
    token: string;
    version: number;
    message?: any;
    app_permissions?: string;
    locale?: string;
    guild_locale?: string;
    entitlements?: any[];
}

export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5
}

export interface ApplicationCommandData {
    id: string;
    name: string;
    type: number;
    resolved?: any;
    options?: ApplicationCommandInteractionDataOption[];
    guild_id?: string;
    target_id?: string;
}

export interface ApplicationCommandInteractionDataOption {
    name: string;
    type: number;
    value?: string | number;
    options?: ApplicationCommandInteractionDataOption;
    focused?: boolean
}

export enum InteractionResponseType {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL = 9
}