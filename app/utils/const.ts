export const ISSUE_TYPES = {
    0: 'Edge Transitions',
    1: 'Center of Gravity',
    2: 'Body Coordination',
    3: 'Pole Usage',
    4: 'Stance Width'
}


export const ISSUE_CODES = {
    'Edge Transitions': 0,
    'Center of Gravity': 1,
    'Body Coordination': 2,
    'Pole Usage': 3,
    'Stance Width': 4
}

export const CATEGORY = {
  SNOWBOARD: 0,
  SKI: 1,
}
// 0-General,1-AASI,2-BASI,3-CASI
export const STANDARD = {
  GENERAL: 0,
  AASI: 1,
  BASI: 2,
  CASI: 3,
  CISA: 4, // Ski specific
};
// type: 0-Flow,1-Carving

export const TYPE = {
  FLOW: 0,
  CARVING: 1,
};

export const CATEGORY_TEXT = {
  [CATEGORY.SNOWBOARD]: 'Snowboard',
  [CATEGORY.SKI]: 'Ski',
};

export const STANDARD_TEXT = {
  [STANDARD.GENERAL]: 'General',
  [STANDARD.AASI]: 'AASI',
  [STANDARD.BASI]: 'BASI',
  [STANDARD.CASI]: 'CASI',
  [STANDARD.CISA]: 'CISA',
};

export const TYPE_TEXT = {
  [TYPE.FLOW]: 'Flow',
  [TYPE.CARVING]: 'Carving',
};
