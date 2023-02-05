interface myApp extends HTMLElement {
    dragToScrollRegistered?: boolean
}


const registerDragToScroll = (app: myApp) => {
    if (!app || app.dragToScrollRegistered) return
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    app.dragToScrollRegistered = true
    console.log('dragToScrollRegistered')

    app.addEventListener('mousedown', mouseDownHandler)

    function mouseDownHandler(event: any) {
        pos = {
            left: app.scrollLeft,
            top: app.scrollTop,
            x: event.clientX,
            y: event.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    function mouseMoveHandler(event: any) {
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;
        app.scrollTop = pos.top - dy;
        app.scrollLeft = pos.left - dx;
    };


    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

}

export default registerDragToScroll