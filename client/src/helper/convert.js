

export default function convertToBase64(file) {
return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = ()  => {
        resolve(fileReader.result) 
    }

    fileReader.Onerror = (error) => {
        reject(error)
    }

})

}