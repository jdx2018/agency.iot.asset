import sheetWorker from 'workerize-loader!./sheetWorker.js';// eslint-disable-line import/no-webpack-loader-syntax

export function analysisBinarySheet(binarySheet, template) {
	const xlsxProcessedWorker = sheetWorker();
	return new Promise((resolve) => {
    xlsxProcessedWorker.analysisBinarySheet(binarySheet, template);
    xlsxProcessedWorker.addEventListener('message', (e) => {
      if (e.data.t === 'd') resolve(e.data.d)
    })
  })
}

export function writeSheetWithTemplateError(
	lostSheetCellList,
  unMatchSheetCellList,
  sheet,
  template,
) {
	const xlsxProcessedWorker = sheetWorker();
	return new Promise((resolve) => {
    xlsxProcessedWorker.writeSheetWithTemplateError(
    	lostSheetCellList,
	    unMatchSheetCellList,
	    sheet,
	    template,
    );
    xlsxProcessedWorker.addEventListener('message', (e) => {
      if (e.data.t === 'd') resolve(e.data.d)
    })
  })
}

export function writeSheetWithDataOrTemplate(sheetsConfig, defaultStyle) {
	const xlsxProcessedWorker = sheetWorker();
	return new Promise((resolve) => {
    xlsxProcessedWorker.writeSheetWithDataOrTemplate(sheetsConfig, defaultStyle);
    xlsxProcessedWorker.addEventListener('message', (e) => {
      if (e.data.t === 'd') resolve(e.data.d)
    })
  })
}

export function writeSheetWithDataError(sheet, errorDataPosition, template, titleMessage, defaultStyle) {
	const xlsxProcessedWorker = sheetWorker();
	return new Promise((resolve) => {
    xlsxProcessedWorker.writeSheetWithDataError(sheet, errorDataPosition, template, titleMessage, defaultStyle);
    xlsxProcessedWorker.addEventListener('message', (e) => {
      if (e.data.t === 'd') resolve(e.data.d)
    })
  })
}

export function transformSheetToBlob(sheet) {
  const xlsxProcessedWorker = sheetWorker();
  return new Promise((resolve) => {
    xlsxProcessedWorker.transformSheetToBlob(sheet);
    xlsxProcessedWorker.addEventListener('message', (e) => {
      if (e.data.t === 'd') resolve(e.data.d)
    })
  })
}