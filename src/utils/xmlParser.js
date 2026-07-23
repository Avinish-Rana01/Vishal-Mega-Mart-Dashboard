/**
 * Robust XML Parser for C# DataSet.GetXml() Output
 */
export function parseXmlDataSet(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const result = { tables: {} };

  if (!xmlDoc.documentElement) return result;

  Array.from(xmlDoc.documentElement.children).forEach((node) => {
    const rawTableName = node.nodeName;
    const lowerName = rawTableName.toLowerCase();

    if (!result.tables[rawTableName]) result.tables[rawTableName] = [];
    if (!result.tables[lowerName]) result.tables[lowerName] = [];

    const rowObj = {};
    Array.from(node.children).forEach((child) => {
      rowObj[child.nodeName] = child.textContent;
      rowObj[child.nodeName.toUpperCase()] = child.textContent;
      rowObj[child.nodeName.toLowerCase()] = child.textContent;
    });

    result.tables[rawTableName].push(rowObj);
    if (lowerName !== rawTableName) {
      result.tables[lowerName].push(rowObj);
    }
  });

  return result;
}
