const fs = require('fs'); // подключаем модуль файловой системы
const path = require('path');
const folderPath = './result';
const folderName = 'i18n';
const EXTENSION = '.json';
const arrayAllObjects = []; // массив для записи объектов из файлов
const arrayAllKeys = []; // массив для записи всех ключей объектов
let keys = null;
let counter = 1;

function nameMaker() { // генерирует название файла
    return 'file-' + (counter++).toString() + '.json';
}

function createFolder() { // создаем папку result
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}
createFolder();

// на вход подается адрес папки, из нее считываются все json файлы
fs.readdir('./i18n', (err, files)=>{

    files.filter( file => { // запустить ф-ю, которая перебирает json файлы и читает их
        if (path.extname(file).toLowerCase() === EXTENSION) { // если файл json
            console.log(file); // выводим названия файлов

                try {
                    const data = fs.readFileSync(path.resolve(folderName, file)); // чтение
                    const obj = JSON.parse(data);
                    console.log(obj); // все объекты, считанные из файлов

                    console.log(Object.keys(obj));
                    keys = Object.keys(obj); // массивы всех ключей объектов

                     // записываю в отдельный массив все объекты из файлов
                     arrayAllObjects.push(obj);
                     console.log(arrayAllObjects);

                    // записываю в отдельный массив все массивы ключей
                    arrayAllKeys.push(keys); 
                    console.log(arrayAllKeys);
                }
                catch (err) {
                    console.error(err)
                }
        }
    });
    // объединяю в массив все внутренние массивы
    const mergedArr = [].concat.apply([], arrayAllKeys);
    console.log(mergedArr);

    // фильтрую массив от дублей
    const filteredArr = [...new Set(mergedArr)];
    console.log(filteredArr);

    // возвращаю преобразованный массив в объект ключ-значение
    const objAll = filteredArr.reduce((newObj, item) => {
        newObj[item] = item;
        return newObj;
    }, {});

    console.log(objAll); // исходный объект с полным списком ключей
    console.log(arrayAllObjects); // массив с объектами из файлов

    // перебираю ключи исходного объекта
    for (let key in objAll) {
        //console.log(`${key}: "${objAll[key]}"`);

        //перебираю массив с вложенными объектами
        for (let obj of arrayAllObjects) {
            // console.log(obj);
            // если нет такого ключа - добавляю этот ключ + значение с заглушкой
            if (obj[key] === undefined) {
                console.log(`${key}: "!!!нет перевода"`);
                obj[key] = "!!!нет перевода";
            } 
        }
    }  
    console.log(arrayAllObjects); // вывожу дополненные объекты

    // сортирую ключи в объектах в алфавитном порядке
    for (let unsortedObj of arrayAllObjects) {
        const fileName = nameMaker(); // генерирую название файла
        console.log(fileName);
        console.log(JSON.stringify(unsortedObj));
        const sortedObjects = Object.keys(unsortedObj).sort().reduce(
            (obj, key) => {
                obj[key] = unsortedObj[key];
                return obj;
            },
            {}
        );
        const result = JSON.stringify(sortedObjects); // сохраняю результат, переведенный в JSON-строку
        // записываю отсортированные объекты в файлы
        fs.appendFileSync(path.join(folderPath, fileName), result);
    }
});