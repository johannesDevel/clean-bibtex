const getNotRequiredFields = (entryType, entryKeys) => {
  let requiredFields = [ 'TITLE' ];
  
  if (entryType === 'ARTICLE') requiredFields = [ 'TITLE', 'AUTHOR', 'JOURNAL', 'YEAR' ];
  if (entryType === 'BOOK') requiredFields = [ 'TITLE', 'AUTHOR', 'PUBLISHER', 'YEAR' ];
  if (entryType === 'BOOKLET') requiredFields = [ 'TITLE' ];
  if (entryType === 'INBOOK') requiredFields = [ 'TITLE', 'AUTHOR', 'PUBLISHER', 'YEAR', 'CHAPTER' ];
  if (entryType === 'INCOLLECTION') requiredFields = [ 'TITLE', 'AUTHOR', 'PUBLISHER', 'YEAR', 'BOOKTITLE' ];
  if (entryType === 'INPROCEEDINGS') requiredFields = [ 'TITLE', 'AUTHOR', 'YEAR', 'BOOKTITLE' ];
  if (entryType === 'MANUAL') requiredFields = [ 'TITLE' ];
  if (entryType === 'MASTERTHESIS') requiredFields = [ 'TITLE', 'AUTHOR', 'SCHOOL', 'YEAR' ];
  if (entryType === 'PHDTHESIS') requiredFields = [ 'TITLE', 'AUTHOR', 'SCHOOL', 'YEAR' ];
  if (entryType === 'PROCEEDINGS') requiredFields = [ 'TITLE', 'YEAR' ];
  if (entryType === 'TECHREPORT') requiredFields = [ 'TITLE', 'AUTHOR', 'JOURNAL', 'YEAR' ];
  if (entryType === 'UNPUBLISHED') requiredFields = [ 'TITLE', 'AUTHOR', 'NOTE' ];

  const nonRequiredFields = entryKeys.filter(key => !requiredFields.includes(key))
  return nonRequiredFields;
};
export default getNotRequiredFields;