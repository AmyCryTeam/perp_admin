export const enum BREAKPOINTS_KEYS {
    XXXL = 'xxxl',
    XXL = 'xxl',
    XL = 'xl',
    LG = 'lg',
    MD = 'md',
    SM = 'sm',
    XS = 'xs',
    XXS = 'xxs'
}

export const BREAKPOINTS: Array<BREAKPOINTS_KEYS> = [
    BREAKPOINTS_KEYS.XXXL,
    BREAKPOINTS_KEYS.XXL,
    BREAKPOINTS_KEYS.XL,
    BREAKPOINTS_KEYS.LG,
    BREAKPOINTS_KEYS.MD,
    BREAKPOINTS_KEYS.SM,
    BREAKPOINTS_KEYS.XS,
    BREAKPOINTS_KEYS.XXS,
];

export const enum AUTH_STATUSES {
    AUTHENTICATED = 'authenticated',
    LOADING = 'loading',
    UNAUTHENTICATED = 'unauthenticated'
}
