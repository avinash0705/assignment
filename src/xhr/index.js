
const structureList = [
    {
        label: "Structure 1",
        id: 1,
        roles: [
            {id: 1, label: "No Accesss"},
            {id: 2, label: "Basic Accesss"},
            {id: 3, label: "Full Accesss"}
        ]
    },
    {
        label: "Structure 2",
        id: 2,
        roles: [
            {id: 1, label: "No Accesss"},
            {id: 2, label: "Basic Accesss"},
            {id: 3, label: "Full Accesss"}
        ]
    },
    {
        label: "Structure 3",
        id: 3,
        roles: [
            {id: 1, label: "No Accesss"},
            {id: 2, label: "Basic Accesss"},
            {id: 3, label: "Full Accesss"}
        ]
    }
]

const mockEntitiesData = [
    {
        id: 1,
        label: "Structure 1",
        roleId: 2,
        roleLabel: "Basic Access",
        countries: [
            {
                id: 101,
                label: "Country 1",
                roleId: 1,
                entities: [
                    { id: 1001, label: "Entity 1", selected: false },
                    { id: 1002, label: "Entity 2", selected: false },
                ],
            },
            {
                id: 102,
                label: "Country 2",
                roleId: 1,
                entities: [
                    { id: 2001, label: "Entity 3", selected: false },
                    { id: 2002, label: "Entity 4", selected: false },
                ],
            },
        ],
    },
    {
        id: 2,
        label: "Structure 2",
        roleId: 3,
        roleLabel: "Full Access",
        countries: [
            {
                id: 103,
                label: "Country 3",
                roleId: 1,
                entities: [
                    { id: 3001, label: "Entity 5", selected: false },
                    { id: 3002, label: "Entity 6", selected: false },
                ],
            },
            {
                id: 104,
                label: "Country 4",
                roleId: 1,
                entities: [
                    { id: 4001, label: "Entity 7", selected: false },
                    { id: 4002, label: "Entity 8", selected: false },
                ],
            },
        ],
    },
    {
        id: 3,
        label: "Structure 3",
        roleId: 3,
        roleLabel: "Full Access",
        countries: [
            {
                id: 105,
                label: "Country 5",
                roleId: 1,
                entities: [
                    { id: 5001, label: "Entity 9", selected: false },
                    { id: 5002, label: "Entity 10", selected: false },
                ],
            },
            {
                id: 106,
                label: "Country 6",
                roleId: 1,
                entities: [
                    { id: 6001, label: "Entity 11", selected: false },
                    { id: 6002, label: "Entity 12", selected: false },
                ],
            },
        ],
    },
];

const membersData = [
    { "user": "Ben Stockton", "email": "ben@dealsplus.io", "organisation": "Dealsplus"},
    { "user": "Sai Padala", "email": "sai@dealsplus.io", "organisation": "Dealsplus"},
    { "user": "Matt Wallis", "email": "matt@dealsplus.io", "organisation": "Phoneix"},
    { "user": "Ben Stockton", "email": "be@dealsplus.io", "organisation": "Dealsplus"},
    { "user": "Sai Padala", "email": "si@dealsplus.io", "organisation": "Dealsplus"},
    { "user": "Matt Wallis", "email": "mtt@dealsplus.io", "organisation": "Phoneix"},
    { "user": "Ben Stockton", "email": "b@dealsplus.io", "organisation": "Dealsplus"},
    { "user": "Sai Padala", "email": "s@dealsplus.io", "organisation": "Dealsplus"},
    { "user": "Matt Wallis", "email": "mat@dealsplus.io", "organisation": "Phoneix"},

];
export const fetchStructuresList = async () => {
    try {
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    data: structureList
                })
            },1000);
        })
    } catch (err) {
        console.warn(err);
    }
}

export const fetchEntities = async () => {
    try {
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    data: mockEntitiesData
                })
            },1000);
        })
    } catch (err) {
        console.warn(err);
    }
}

export const fetchMembers = async () => {
    try {
        return new Promise((res) => {
            setTimeout(() => {
                res({
                    data: membersData
                })
            },1000);
        })
    } catch (err) {
        console.warn(err);
    }
}

