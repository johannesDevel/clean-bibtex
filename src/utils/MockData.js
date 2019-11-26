const mockData = {
  bibtexText: "",
  entries: [
    {
      id: 1,
      author: "Milton Abramowitz and Irene A. Stegun",
      title: "Handbook of mathematical Functions with Tables"
    },
    {
      id: 2,
      author: "Bex, Floris and Villata, Serena",
      title:
        "Legal knowledge and information systems: JURIX 2016: the twenty-ninth annual conference"
    },
    {
      id: 3,
      author: "Winkels, Raboud Maarten",
      title: "Section Structure of Dutch Court Judgments"
    },
    {
      id: 4,
      author: "Trompper, Maarten and Winkels, Raboud",
      title:
        "Automatic Assignment of Section Structure to Texts of Dutch Court Judgments"
    },
    {
      id: 5,
      author: "Stallings, William",
      title: "Computer Security Principles and Practice"
    }
  ],
  categories: {
    capitalization: {
      titleCase: [3, 4],
      sentenceCase: [2],
      caseNotFound: [1]
    },
    authorName: {},
    missingRequiredFields: {
    }
  },
  corrections: {
    capitalization: [
      {
        id: 1,
        correctionType: "TitleCase",
        entryId: 1,
        title: "Handbook of Mathematical Functions With Tables"
      },
      {
        id: 2,
        correctionType: "TitleCase",
        entryId: 2,
        title:
          "Legal Knowledge and Information Systems: JURIX 2016: the Twenty-Ninth Annual Conference"
      },
      {
        id: 3,
        correctionType: "SentencesCase",
        entryId: 1,
        title: "Handbook of mathematical functions with tables"
      },
      {
        id: 4,
        correctionType: "SentencesCase",
        entryId: 2,
        title:
          "Legal knowledge and information systems: JURIX 2016: the twenty-ninth annual conference"
      }
    ]
  }
};
export default mockData;
