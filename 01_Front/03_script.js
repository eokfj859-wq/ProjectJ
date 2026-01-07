// 1. 기존 변수들 + 모달 관련 변수 추가
const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn'); // 이제 + 버튼 역할
const todoList = document.getElementById('todoList');

// [추가] 모달 관련 엘리먼트
const modal = document.getElementById('todoModal');
const saveBtn = document.getElementById('saveBtn');
const closeBtn = document.getElementById('closeBtn');

// [추가] 모달 내부 입력창들
const detailTitle = document.getElementById('detailTitle');
const detailDate = document.getElementById('detailDate');
const detailTime = document.getElementById('detailTime');
const detailDesc = document.getElementById('detailDesc');

// 데이터 로드 (기존과 동일)
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];


// 저장 및 렌더링 함수 (기존과 동일)
function save() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

// --- [수정 및 추가된 기능들] ---

// 1. 모달 열기/닫기 로직
const openModal = () => {
    // 메인 페이지의 짧은 입력창에 글자가 있다면 상세 제목에 미리 넣어주기
    detailTitle.value = input.value; 
    modal.classList.remove('hidden');
};

const closeModal = () => {
    modal.classList.add('hidden');
    // 닫을 때 입력값들 초기화
    detailTitle.value = '';
    detailDate.value = '';
    detailTime.value = '';
    detailDesc.value = '';
    input.value = '';
};

// 2. 상세 데이터 저장 (기존 addTodo를 확장)
function saveDetailedTodo() {
    if (detailTitle.value.trim() === '') {
        alert('제목은 필수입니다!');
        return;
    }

    // [중요] 할 일 데이터를 더 풍부한 객체로 생성
    const newTodo = {
        id: Date.now(),
        text: detailTitle.value,      // 제목
        date: detailDate.value,       // 날짜
        time: detailTime.value,       // 시간
        desc: detailDesc.value,       // 메모
        completed: false
    };

    todos.push(newTodo);
    save();
    render();
    closeModal(); // 저장 후 모달 닫기
}

// 3. 목록 출력 (상세 정보까지 보이도록 수정)
function render() {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        
        // 날짜와 시간이 있을 때만 표시해주는 작은 로직 추가
        const dateTimeInfo = (todo.date || todo.time) 
            ? `<small>${todo.date} ${todo.time}</small>` 
            : '';

        li.innerHTML = `
            <div class="todo-item">
                <span class="${todo.completed ? 'completed' : ''}" 
                      onclick="toggleTodo(${todo.id})">
                    <strong>${todo.text}</strong> ${dateTimeInfo}
                    <p class="todo-memo">${todo.desc}</p>
                </span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// --- [기존 로직 유지] ---
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    save();
    render();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    save();
    render();
}

// --- [이벤트 연결] ---

// + 버튼 누르면 상세 입력창(모달) 띄우기
addBtn.addEventListener('click', openModal);

// 모달 안의 저장/취소 버튼
saveBtn.addEventListener('click', saveDetailedTodo);
closeBtn.addEventListener('click', closeModal);

// 초기 렌더링
render();