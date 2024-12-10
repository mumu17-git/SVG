/**
 * SVG情報を取得する
 * @returns {{ element: HTMLElement, viewBox: { x: number, y: number, width: number, height: number }}}
 */
function getSvgInfo() {
    const svgElement = document.body.children.item(1);
    console.log(document.body.children.item(1));
    const viewBoxParams = svgElement.getAttribute('viewBox').split(' ').map((param) => +param);
    return {
        element: svgElement,
        viewBox: {
            x: viewBoxParams[0],
            y: viewBoxParams[1],
            width: viewBoxParams[2],
            height: viewBoxParams[3]
        }
    };
}


function getSvgCoord() {
    // SVG情報を取得する
    const svgInfo = getSvgInfo();
    const pathElement = svgInfo.element.childNodes()[0];

    // 今の位置のSVG座標を求める
    const pt = pathElement.getPointAtLength(0);

    console.log(pt);
}

setTimeout(getSvgCoord,3000);