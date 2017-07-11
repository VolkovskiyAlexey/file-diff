let fs = require("fs");


Array.prototype.insert = function (index) {
    index = Math.min(index, this.length);
    arguments.length > 1
    && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
    && this.insert.apply(this, arguments);
    return this;
};


let diff = function (path1, path2) {
    let results = [];

    let file1FirstIdenticalIndex = -1;
    let file2FirstIdenticalIndex = -1;
    let fileArray1 = [];
    let fileArray2 = [];

    fileArray1 = fs.readFileSync(path1).toString().split('\n');
    fileArray2 = fs.readFileSync(path2).toString().split('\n');


    // fill array with NULL => create equal arrays

    function fillArrays() {

        let newDuplicateFound = false;

        for (let i = file1FirstIdenticalIndex + 1; i <= fileArray1.length; i++) {
            let file1Val = fileArray1[i];

            let file2Index = fileArray2.indexOf(file1Val, file2FirstIdenticalIndex + 1);
            if (file2Index > -1) {
                file1FirstIdenticalIndex = i;
                file2FirstIdenticalIndex = file2Index;

                if (file1FirstIdenticalIndex) {
                    newDuplicateFound = true;
                    break;
                }
            }
        }

        let diff = 0;

        if (newDuplicateFound) {
            diff = file1FirstIdenticalIndex - file2FirstIdenticalIndex;
            let arr = Array.apply(null, new Array(Math.abs(diff))).map((val) => null);

            if (diff > 0) {
                fileArray2.insert(file2FirstIdenticalIndex, arr);
            } else {
                fileArray1.insert(file1FirstIdenticalIndex, arr);
            }

        } else {
            return true;
        }

        if (fileArray1.length != fileArray2.length) {
            fillArrays()
        } else {
            return true;
        }
    }

    fillArrays();


    // format result for 2 arrays

    let resultIndex = 0;
    for (let i = 0; i <= Math.max(fileArray1.length, fileArray2.length); i++) {
        let file1Val = fileArray1[i] || null;
        let file2Val = fileArray2[i] || null;

        if (file1Val === null && file2Val === null) continue;

        if (file1Val !== file2Val) {


            if (file1Val !== null && file2Val === null) {
                results[resultIndex] = [resultIndex + 1, '-', `${file1Val}`];
            }
            else if (file1Val !== null && file2Val !== null) {
                results[resultIndex] = [resultIndex + 1, '*', `${file1Val}|${file2Val}`];
            }
            else {
                results[resultIndex] = [resultIndex + 1, '+', `${file2Val}`];

            }

        } else {
            results[resultIndex] = [resultIndex + 1, ' ', `${file1Val}`];
        }

        resultIndex++;
    }

    return results;
}


module.exports = diff;