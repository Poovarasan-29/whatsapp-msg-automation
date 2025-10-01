import * as XLSX from 'xlsx'

function xlsxToJson(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided")
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target.result;

            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            resolve(XLSX.utils.sheet_to_json(worksheet, { header: ['PhoneNumber'], }))
        }
        reader.readAsArrayBuffer(file)
    })
}

export default xlsxToJson;