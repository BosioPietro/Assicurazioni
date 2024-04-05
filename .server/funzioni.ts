
const DataInStringa = (data: Date) => {
    const giorno = data.getDate().toString().padStart(2, "0")
    const mese = (data.getMonth() + 1).toString().padStart(2, "0")
    const anno = data.getFullYear();
    const ora = data.getHours().toString().padStart(2, "0");
    const minuti = data.getMinutes().toString().padStart(2, "0");
    return `${giorno}/${mese}/${anno}-${ora}:${minuti}`
}

const StringaInData = (data: string) => {
    const [dataStr, ora] = data.split("-")
    const [giorno, mese, anno] = dataStr.split("/")
    const [ore, minuti] = ora.split(":")
    return new Date(parseInt(anno), parseInt(mese) - 1, parseInt(giorno), parseInt(ore), parseInt(minuti))
}

export { DataInStringa, StringaInData}