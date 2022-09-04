const readAct = [];
const RENDER_EVENT = 'render-readtAct';

document.addEventListener('DOMContentLoaded', function() {
    const submitAct = document.getElementById('form');

    submitAct.addEventListener('submit', function(event){
        event.preventDefault();
        saveReadAct();
    });
});

function saveReadAct () {
    const bookTitle = document.getElementById('title').value;
    const bookDate = document.getElementById('date').value;

    const getId = generateId();
    //generated objek todo
    const readActObj = generateActObj(getId, bookTitle, bookDate, false);
    readAct.push(readActObj);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId () {
    return +new Date();
}

function generateActObj (id, book, tmstamp, isCompleted) {
    return{
        id,
        book,
        tmstamp,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    console.log(readAct);

    const uncompletedReadActList = document.getElementById('todo');
    uncompletedReadActList.innerText=' ';

    const completedReadAct = document.getElementById('finished'); 
    completedReadAct.innerText = ' ';

    for(const item of readAct) {
        const itemElement = makeItem(item);
        if(!itemElement.isCompleted) {
            uncompletedReadActList.append(itemElement);
        } else {
            completedReadAct.append(itemElement);
        }
    };
});

//Make container act
function makeItem (actObject) {
    const tittleAct = document.createElement('h2');
    tittleAct.innerText = actObject.book;

    const tmstampAct = document.createElement('p');
    tmstampAct.innerText = actObject.tmstamp;

    const actContainer = document.createElement('div');
    actContainer.classList.add('inner');
    actContainer.append(tittleAct, tmstampAct);

    const container = document.createElement('div');
    container.classList.add('list', 'shadow');
    container.append(actContainer);
    container.setAttribute('id', 'act-${actObject.id}')

    //Mengambil nilai pada checkbox
    if(actObject.isCompleted) {
        const undoBtn = document.createElement('button');
        undoBtn.classList.add('undo-btn');

        undoBtn.addEventListener('click', function() {
            undoActCmpltd(actObject.id);
        });

        const trashBtn = document.createElement('button');
        trashBtn.classList.add('trash-btn');

        trashBtn.addEventListener('click', function(){
            removeActCmpltd(actObject.id);
        });

        container.append(undoBtn, trashBtn)
    } else {
        const checkedBtn = document.createElement('button');
        checkedBtn.classList.add('add-btn');

        checkedBtn.addEventListener('click', function() {
            addActCmpltd(actObject.id);


        });
        container.append(checkedBtn);
    }

    function addActCmpltd(actId) {
        const actTarget = findAct(actId);

        if(actTarget == null) return;

        actTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function findAct (actId) {
        for (const actItem of readAct) {
            if(actItem.id === actId) {
                return actItem;
            }
        }
        return null;
    }

    function removeActCmpltd (actId) {
        const actTarget = findAct(actId);
        if(actTarget === -1) return;

        actTarget.splice(actTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function undoActCmpltd (actId) {
        const actTarget = findAct(actId);

        if(actTarget == null) return;

        actTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function findActIndex(todoId) {
        for(const index in readAct) {
            if(readAct[index].id === readAct) {
                return index;
            }
        }
        return -1;
    }
    return container;
}