const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
/**
 * document: 브라우저가 읽어들인 전체 HTML 문서를 담고 있는 거대한 객체입니다.
.getElementById('todoInput'): "전체 문서 중에서 id가 todoInput인 녀석을 찾아와!"라는 뜻입니다.
const input: 찾은 그 HTML 태그를 input이라는 변수에 담습니다. 이제 JS에서 이 변수를 조작하면 
실제 화면의 입력창이 움직입니다.
 */


// [수정] 1. 시작할 때 로컬 스토리지에서 데이터를 가져옵니다. 
// 데이터가 없으면 빈 배열([])을 기본값으로 사용합니다.
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

// [추가] 2. 로컬 스토리지에 현재 todos 상태를 저장하는 함수
function save() {
    // 로컬 스토리지는 문자열만 저장할 수 있어서 JSON.stringify로 변환해야 합니다.
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

function addTodo() {
    if (input.value.trim() === '') return;

    // 할 일 데이터를 객체로 생성 (Key: Value 구조)
    const newTodo = {
        id: Date.now(), // 고유한 ID값 (삭제나 수정을 위해 필요)
        text: input.value, // 입력한 텍스트
        completed: false // 완료 여부 (기본값은 false)
    };

    todos.push(newTodo); // 배열에 추가
    input.value = ''; //입력글자 초기화>버튼 누르면 글자 지워지게 하는 기능

    save(); // [추가] 데이터 변경 후 저장
    render();
}

//기존 목록 지우고 다시 데이터 있는만큼 html에 올리는 기능
function render() {
    // 기존의 목록을 싹 지웁니다.
    // 비우지 않으면 새로 추가할 때마다 이전 목록 뒤에 중복해서 붙기 때문입니다.
    todoList.innerHTML = '';

    //todos 배열(메모리)에 저장된 객체들을 하나씩 꺼내서 확인합니다.
    todos.forEach(todo => {

        // 메모리 상에 <li> 태그라는 '객체'를 하나 생성합니다. (아직 화면엔 안 보임)
        const li = document.createElement('li');

        // 생성한 <li> 태그 안에 들어갈 내용을 작성합니다.
        // 여기서 `todo.text`는 우리가 객체에 저장했던 그 문자열입니다.
        //
        li.innerHTML = `
            <span class="${todo.completed ? 'completed' : ''}"
                  onclick="toggleTodo(${todo.id})">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
        `;
          /**
          * ${todo.completed ? 'completed' : ' '} : 삼항 연산자
            이 부분은 조건문입니다. todo 객체의 완료 상태에 따라 HTML 클래스를 다르게 줍니다.
            조건: todo.completed가 true인가?
            참이면: 'completed'라는 클래스 이름을 넣음 (CSS에서 선을 긋는 스타일 적용).
            거짓이면: ''(빈 문자열)을 넣음.
    
            onclick="toggleTodo(${todo.id})" : 이벤트 연결
            이 부분이 바로 데이터(JS)와 화면(HTML)을 연결하는 고리입니다.
            만약 todo.id가 1704456이라면, 브라우저에는 <span onclick="toggleTodo(1704456)">
            라고 그려집니다.
            사용자가 이 글자를 클릭하면, JS의 toggleTodo 함수가 실행되면서
             "아, 1704456번 할 일을 완료 처리하라는 거구나!"라고 알게 됩니다.
         */


        // 완성된 <li>를 우리 눈에 보이는 <ul>(todoList) 안에 자식으로 넣습니다.
        todoList.appendChild(li);
    });
}

// 상태 변경 (가변성 활용: 객체의 속성값만 변경)
function toggleTodo(id) {

    /**
     * { ...todo, completed: !todo.completed }: 
     * 이 부분은 "기존 객체의 내용을 다 복사해오되(...todo), completed 값만 반대로 바꿔서 
     * 새로운 객체를 만들어줘"라는 뜻입니다.
     * 
     * 이건 "스위치(Toggle)" 기능을 만들기 위해서예요.
        우리가 할 일을 클릭할 때, "미완료(false)"였으면 "완료(true)"로 바꾸고 싶고, 
        실수로 클릭했다면 다시 "미완료(false)"로 되돌리고 싶죠?
        ! (Not 연산자): true를 false로, false를 true로 뒤집어줍니다.
        completed: !todo.completed: "현재 상태가 뭐든 간에 그 반대로 바꿔서 저장해줘"라는 
        뜻입니다.
     * 
        ...와 새로운 객체를 만드는 이유: 원본을 망가뜨리지 않고 안전하게 "변화된 상태"를 
        시스템에 알리기 위해(C언어에서 원본 데이터를 보존하면서 복사본 배열을 만드는 것과 비슷)
        React(리액트)같은 기술은 이 방식을 써야만 화면이 업데이트됩니다.

        JS에서는 원본 데이터를 직접 수정하기보다, 이렇게 새로운 객체로 교체하는 방식
        (불변성 유지 패턴)을 리액트 같은 현대 프레임워크에서 선호합니다.
     */
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    save(); // [추가] 데이터 변경 후 저장
    render();
}

//true데이터만 추리고 false인 데이터 걸러서 삭제된 듯이 없애는 기능
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
//todo => todo.id !== id라는 함수를 filter에게 전달한 겁니다. 
// filter는 이 함수를 실행해보고 결과가 true인 데이터만 모아서 새로운 배열을 만듭니다.

    save(); // [추가] 데이터 변경 후 저장
    render();
}

// 시작하자마자 저장된 데이터 보여주기
render();

//추가버튼 누르면 addTodo함수 실행 기
addBtn.addEventListener('click', addTodo);
/**
 * addBtn: 아까 getElementById로 붙잡아둔 '추가' 버튼 객체입니다.
addEventListener: "무슨 일이 생기나 잘 지켜보고 있어!"라고 명령하는 함수입니다.
'click': "사용자가 이 버튼을 클릭하는 사건"이 감시 대상입니다.
addTodo: "클릭 사건이 터지면, 내가 미리 만들어둔 **addTodo 함수(상자)**를 실행해!"라는 뜻입니다.
 */