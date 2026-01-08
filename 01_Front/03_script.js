// 1. 서버 주소 설정 (코드스페이스 포트 5000번 주소)
const SERVER_URL = "https://cuddly-spork-v69rrg7x955j3494-5000.app.github.dev";

// HTML 엘리먼트들 (기존과 동일)
const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const modal = document.getElementById('todoModal');
const saveBtn = document.getElementById('saveBtn');
const closeBtn = document.getElementById('closeBtn');
const detailTitle = document.getElementById('detailTitle');
const detailDate = document.getElementById('detailDate');
const detailTime = document.getElementById('detailTime');
const detailDesc = document.getElementById('detailDesc');

let todos = []; // 이제 데이터는 서버에서 가져올 것이므로 빈 배열로 시작

// 2. [추가] 서버에서 데이터 가져오기 (Read - GET)
async function fetchTodos() {
    try {
        const response = await fetch(`${SERVER_URL}/api/todos`);
        if (!response.ok) throw new Error('서버 응답 오류');
        todos = await response.json();
        render();
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

// 3. [수정] 서버에 데이터 저장하기 (Create - POST)
async function saveDetailedTodo() {
    if (detailTitle.value.trim() === '') {
        alert('제목은 필수입니다!');
        return;
    }

    const newTodo = {
        text: detailTitle.value,
        date: detailDate.value,
        time: detailTime.value,
        desc: detailDesc.value,
        completed: false
    };

    try {
        const response = await fetch(`${SERVER_URL}/api/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });

        if (response.ok) {
            const savedData = await response.json(); // 서버가 생성한 ID가 포함된 데이터
            todos.push(savedData);
            render();
            closeModal();
        }
    } catch (error) {
        console.error("저장 실패:", error);
    }
}

// 4. [수정] 삭제 로직 (Delete - DELETE)
async function deleteTodo(id) {
    try {
        const response = await fetch(`${SERVER_URL}/api/todos/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            todos = todos.filter(todo => todo.id !== id);
            render();
        }
    } catch (error) {
        console.error("삭제 실패:", error);
    }
}

// 5. [수정] 완료 상태 변경 (Update - PATCH)
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
        // 여기서는 예시로 로컬 데이터만 바꾸지만, 
        // 실제로는 서버에도 수정한 정보를 보내야 완벽합니다.
        todo.completed = !todo.completed;
        render();
    } catch (error) {
        console.error("상태 변경 실패:", error);
    }
}

// --- 나머지 렌더링 및 모달 로직은 동일 ---
function render() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        const dateTimeInfo = (todo.date || todo.time) ? `<small>${todo.date} ${todo.time}</small>` : '';
        li.innerHTML = `
            <div class="todo-item">
                <span class="${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
                    <strong>${todo.text}</strong> ${dateTimeInfo}
                    <p class="todo-memo">${todo.desc}</p>
                </span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// 모달 함수 및 이벤트 연결
const openModal = () => { detailTitle.value = input.value; modal.classList.remove('hidden'); };
const closeModal = () => { modal.classList.add('hidden'); /* 입력창 초기화 로직... */ };

addBtn.addEventListener('click', openModal);
saveBtn.addEventListener('click', saveDetailedTodo);
closeBtn.addEventListener('click', closeModal);

// 앱 시작 시 서버에서 데이터 불러오기
fetchTodos();