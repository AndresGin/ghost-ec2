export const sites = {
    SEMINUEVOS: 'seminuevos',
    PATIOTUERCA_ECUADOR: 'ecuador',
    PATIOTUERCA_BOLIVIA: 'bolivia',
    PATIOTUERCA_PANAMA: 'panama',
    AUTOFOCO: 'autofoco',
    TODOAUTOS: 'todoautos',
}
export const config = {
    getAllPostInSearch: 250,
    [sites.SEMINUEVOS]: {
        gtm: 'GTM-KZFT3J',
        keyIntegration: '1daa969627a78c5cbc1def8559',
        social: {
            facebook: "https://www.facebook.com/Seminuevos.mx",
            twitter: "https://twitter.com/MxSeminuevos",
            youtube: "https://www.youtube.com/channel/UCvAXK9UeKdC4ecXgVCODsXw?view_as=subscriber",
            instagram: "https://www.instagram.com/seminuevosmx/",
        },
        ghost: "https://ghost.seminuevos.com",
        domain: 'https://www.seminuevos.com',
    },
    [sites.PATIOTUERCA_ECUADOR]: {
        gtm: 'GTM-5B7GFK',
        keyIntegration: '180f2a866e9cc82b6f24ebf9d6',
        social: {
            facebook: "https://www.facebook.com/PATIOTuerca",
            twitter: "https://twitter.com/PATIOTuerca",
            youtube: "https://www.youtube.com/user/PATIOtuerca",
            instagram: "https://www.instagram.com/patiotuerca/",
        },
        ghost: "https://ghost-ecuador.patiotuerca.com",
        domain: 'https://ecuador.patiotuerca.com',
    },
    [sites.PATIOTUERCA_BOLIVIA]: {
        gtm: 'GTM-NZ69K2',
        keyIntegration: '5c6ffc838957fef088a9673704',
        social: {
            facebook: "https://www.facebook.com/PATIOTuercaBO",
            twitter: "https://twitter.com/patiotuercabo",
            youtube: "https://www.youtube.com/channel/UCPYN_LBT1EIGEgNa_NZIXjw",
            instagram: "",
        },
        ghost: "https://ghost-bolivia.patiotuerca.com",
        domain: 'https://bolivia.patiotuerca.com',
    },
    [sites.PATIOTUERCA_PANAMA]: {
        gtm: 'GTM-T2GX4D',
        keyIntegration: '45e321264717cf2ffaa0645f7c',
        social: {
            facebook: "https://www.facebook.com/PATIOTuerca",
            twitter: "https://twitter.com/PATIOTuercaPTY",
            youtube: "https://www.youtube.com/channel/UCTR_w4gqlHHb3A9qpzjx9GQ",
            instagram: "",
        },
        ghost: "https://ghost-panama.patiotuerca.com",
        domain: 'https://panama.patiotuerca.com',
    },
    [sites.AUTOFOCO]: {
        gtm: 'GTM-NBKTZD',
        keyIntegration: '4702b56b42eadf04947c7b260d',
        social: {
            facebook: "https://www.facebook.com/AUTOFocoAR/",
            twitter: "https://twitter.com/AUTOFoco",
            youtube: "https://www.youtube.com/channel/UCJZ4M-5IGPRCFc3w7G-xAhQ",
            instagram: "https://www.instagram.com/autofocoar/",
        },
        ghost: "https://ghost.autofoco.com",
        domain: 'https://www.autofoco.com',
    },
    [sites.TODOAUTOS]: {
        gtm: 'GTM-TBG8TW',
        keyIntegration: 'fef4f15fcf733cc01f4bd13893',
        social: {
            facebook: "https://www.facebook.com/TodoAutos",
            twitter: "https://twitter.com/todoautos",
            youtube: "https://www.youtube.com/user/todoautosTV",
            instagram: "https://www.instagram.com/todoautos.pe/",
        },
        ghost: "https://ghost-peru.todoautos.com.pe",
        domain: 'https://peru.todoautos.com.pe',
    }
};
