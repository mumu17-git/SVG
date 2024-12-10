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
        console.log(pathElement.getTotalLength());

        for(var i = 0;i < pathElement.getTotalLength();i++) {
            const pt = pathElement.getPointAtLength(i);
            pathStr += String(pt.x);
            pathStr += ",";
            pathStr += String(pt.y);
            pathStr += ",";
            console.log(i,pt);
        }
        pathStr += ")";
        pathStr = pathStr.replace(",)",")");
    }

    console.log(pathStr);
}

  
document.body.insertAdjacentHTML("beforeend",'<object type="image/svg+xml" data="mplus_stroke/kanji-01/亜.svg" onload="getSvgInfoFromObjectElement(this).then((svgInfo) => {console.log(svgInfo.element);getSvgCoord(svgInfo);});" width="300" height="300"></object>');
