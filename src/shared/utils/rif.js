export const formatRIF = (rif, docType = 'J') => {
  if (!rif) return `${docType}-00000000-0`;
  
  let cleanRif = '';
  let rifDocType = docType;
  
  if (rif.includes('-')) {
    rifDocType = rif.charAt(0);
    cleanRif = rif.replace(/\D/g, '');
  }
  else if (/^[GJ]\d+$/.test(rif)) {
    rifDocType = rif.charAt(0);
    cleanRif = rif.slice(1);
  }
  else {
    cleanRif = rif.replace(/\D/g, '');
  }
  
  if (cleanRif.length === 0) return `${rifDocType}-00000000-0`;
  
  if (cleanRif.length <= 8) {
    const padded = cleanRif.padStart(8, '0');
    return `${rifDocType}-${padded.slice(0, -1)}-${padded.slice(-1)}`;
  } else {
    return `${rifDocType}-${cleanRif.slice(0, -1)}-${cleanRif.slice(-1)}`;
  }
};

export const getRawRIFFormat = (rif) => {
  if (!rif) return '';
  
  if (/^[GJ]\d+$/.test(rif)) {
    return rif;
  }
  
  if (rif.includes('-')) {
    const docType = rif.charAt(0);
    const numbers = rif.replace(/\D/g, '');
    return `${docType}${numbers}`;
  }
  
  const cleanNumbers = rif.replace(/\D/g, '');
  return `J${cleanNumbers}`;
};

export const extractRIFNumbers = (rif) => {
  if (!rif) return '';
  
  if (/^[GJ]\d+$/.test(rif)) {
    return rif.slice(1);
  }
  
  if (rif.includes('-')) {
    return rif.replace(/\D/g, '');
  }
  
  return rif.replace(/[^0-9]/g, '');
};
