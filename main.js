/**
 * object要素からsvg情報を取得する
 * @param {element} objectElement - objectタグ要素
 * @return {Promise} - resolveでsvg情報を返す
 */
function getSvgInfoFromObjectElement(objectElement) {
    return new Promise((resolve) => {
        const loadSvgElement = () => {
            const svgElement = objectElement.contentDocument ? objectElement.contentDocument.querySelector('svg') : null;
            if (svgElement) {
                const viewBoxParams = svgElement.getAttribute('viewBox').split(' ').map((param) => +param);
                resolve({
                element: svgElement,
                viewBox: {
                    x: viewBoxParams[0],
                    y: viewBoxParams[1],
                    width: viewBoxParams[2],
                    height: viewBoxParams[3]
                }
                });
            } else {
                // まだSVGを読み込めていない場合はonloadしてから再度取得しにいく
                objectElement.onload = loadSvgElement;
            }
        };
        loadSvgElement();
    });
}


function getSvgCoord(svgInfo) {
    const pathElements = svgInfo.element.children;
    var pathStr = "";
    for(var c = 0;c < pathElements.length;c++) {
        if(c != 0) {
            pathStr += ",";
        }
        const pathElement = pathElements[c];
        pathStr += "(";
        //console.log(pathElement.getTotalLength());

        for(var i = 0;i < pathElement.getTotalLength();i++) {
            const pt = pathElement.getPointAtLength(i);
            pathStr += String(pt.x);
            pathStr += ",";
            pathStr += String(pt.y);
            pathStr += ",";
            //console.log(i,pt);
        }
        pathStr += ")";
        pathStr = pathStr.replace(",)",")");
    }

    //console.log(pathStr);

    cdata.push(pathStr);
}

function objLoad(str) {
    document.body.insertAdjacentHTML("beforeend",'<object type="image/svg+xml" data="mplus_stroke/data/'+str+'.svg" onload="getSvgInfoFromObjectElement(this).then((svgInfo) => {getSvgCoord(svgInfo);});" width="300" height="300"></object>');
}

//CSVファイルを読み込む関数getCSV()の定義
function getCSV(){
    var req = new XMLHttpRequest();
    req.open("get", "kanji-01.csv", true);
    req.send(null);
		
    req.onload = function(){
	    //console.log(convertCSVtoArray(req.responseText));
        var arr = convertCSVtoArray(req.responseText);
        for(var i = 0;i < arr.length;i++) objLoad(arr[i]);
    }
}


// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str){
    return str.split("\n");
}

var cdata = [];

function downloadCSV() {
    const filename = "data.csv";
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    
    const blob = new Blob([bom, cdata.join("\n")], { type: "text/csv" });
   
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();

    URL.revokeObjectURL(link.href);
}
  

getCSV();