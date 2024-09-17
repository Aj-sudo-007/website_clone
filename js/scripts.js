document.addEventListener('DOMContentLoaded', () => {
            const navLinks = document.querySelectorAll('nav a');
            const sections = document.querySelectorAll('main section');
            const titleImage = document.getElementById('title-image');
            const removeTitleImageBtn = document.getElementById('remove-title-image-btn');
        
            let titleImageSrc = localStorage.getItem('titleImageSrc') || null;
        
            // Navigation handling
            function navigateTo(targetSectionId) {
                sections.forEach(section => section.style.display = 'none');
        
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.style.display = 'block';
        
                    // Section-specific loading
                    switch (targetSectionId) {
                        case 'calendar':
                            loadCalendar();
                            break;
                        case 'music':
                            loadMusicPlayer();
                            break;
                        case 'todo':
                            loadTodoList();
                            break;
                        case 'gallery':
                            loadGallery();
                            break;
                    }
                }
        
                updateTitleImage();
            }
        
            navLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    const target = link.getAttribute('href');
                    if (target.startsWith('#')) {
                        event.preventDefault();
                        navigateTo(target.substring(1));
                    }
                });
            });
        
            // Get Started button
            const getStartedButton = document.querySelector('.cta-button');
            getStartedButton?.addEventListener('click', () => alert("Welcome, friends!")); 
        
          // Calendar functionality
    function loadCalendar() {
        const calendarContainer = document.getElementById('calendar-container');
        const addEventBtn = document.getElementById('add-event-btn');
        const eventTitleInput = document.getElementById('event-title');
        const eventDateInput = document.getElementById('event-date');
        const eventTimeInput = document.getElementById('event-time');
        const eventModal = document.getElementById('event-modal');
        const closeModal = document.querySelector('.close');
        const editEventBtn = document.getElementById('edit-event-btn');
        const deleteEventBtn = document.getElementById('delete-event-btn');

        let events = JSON.parse(localStorage.getItem('events')) || [];
        renderCalendar();

        // Add event functionality
        if (addEventBtn) { 
            addEventBtn.addEventListener('click', () => {
                const title = eventTitleInput.value.trim();
                const date = eventDateInput.value;
                const time = eventTimeInput.value;

                if (title && date && time) {
                    const newEvent = { title, date, time };
                    events.push(newEvent);
                    localStorage.setItem('events', JSON.stringify(events));
                    renderCalendar();
                    eventTitleInput.value = '';
                    eventDateInput.value = '';
                    eventTimeInput.value = '';
                } else {
                    alert("Please fill in all the event details.");
                }
            });
        }

        function renderCalendar() {
            calendarContainer.innerHTML = '<h3>Upcoming Events:</h3>';

            if (events.length === 0) {
                calendarContainer.innerHTML += '<p>No events yet.</p>';
            } else {
                const eventList = document.createElement('ul');
                events.forEach((event, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${event.title} - ${event.date} at ${event.time}`;
                    listItem.dataset.index = index; 

                    listItem.addEventListener('click', () => {
                        openModal(index);
                    });

                    eventList.appendChild(listItem);
                });
                calendarContainer.appendChild(eventList);
            }
        }

        function openModal(index) {
            const event = events[index];
            document.getElementById('modal-event-title').value = event.title;
            document.getElementById('modal-event-date').value = event.date;
            document.getElementById('modal-event-time').value = event.time;
            eventModal.style.display = 'block';

            editEventBtn.dataset.index = index;
            deleteEventBtn.dataset.index = index;
        }

        closeModal.addEventListener('click', () => {
            eventModal.style.display = 'none';
        });

        editEventBtn.addEventListener('click', () => {
            const index = editEventBtn.dataset.index;
            const updatedTitle = document.getElementById('modal-event-title').value.trim();
            const updatedDate = document.getElementById('modal-event-date').value;
            const updatedTime = document.getElementById('modal-event-time').value;

            if (updatedTitle && updatedDate && updatedTime) {
                events[index] = { title: updatedTitle, date: updatedDate, time: updatedTime };
                localStorage.setItem('events', JSON.stringify(events));
                renderCalendar();
                eventModal.style.display = 'none';
            } else {
                alert("Please fill in all the event details.");
            }
        });

        deleteEventBtn.addEventListener('click', () => {
            const index = deleteEventBtn.dataset.index;
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
            renderCalendar();
            eventModal.style.display = 'none';
        });
    }
        
          // Music Player functionality
    function loadMusicPlayer() {
        const audioPlayer = document.getElementById('audio-player');
        const musicUpload = document.getElementById('music-upload');
        const playlist = document.getElementById('playlist');
        const playPauseBtn = document.getElementById('play-pause');
        const nextBtn = document.getElementById('next');
        const prevBtn = document.getElementById('previous');
        const volumeControl = document.getElementById('volume-control');

        let currentTrackIndex = 0;
        let tracks = [];

        musicUpload.addEventListener('change', (event) => {
            const files = event.target.files;
            for (const file of files) {
                const track = {
                    title: file.name,
                    src: URL.createObjectURL(file)
                };
                tracks.push(track);
                addTrackToPlaylist(track);
            }
            if (tracks.length > 0) {
                playTrack(0);
            }
        });

        function addTrackToPlaylist(track) {
            const listItem = document.createElement('li');
            listItem.textContent = track.title;
            listItem.addEventListener('click', () => {
                const index = tracks.findIndex(t => t.title === track.title);
                playTrack(index);
            });
            playlist.appendChild(listItem);
        }

        function playTrack(index) {
            if (index >= 0 && index < tracks.length) {
                currentTrackIndex = index;
                audioPlayer.src = tracks[index].src;
                audioPlayer.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
                playPauseBtn.textContent = 'Pause';
                updatePlaylistHighlight();
            }
        }

        function updatePlaylistHighlight() {
            const playlistItems = playlist.querySelectorAll('li');
            playlistItems.forEach((item, index) => {
                if (index === currentTrackIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
                playPauseBtn.textContent = 'Pause';
            } else {
                audioPlayer.pause();
                playPauseBtn.textContent = 'Play';
            }
        });

        nextBtn.addEventListener('click', () => {
            playTrack(currentTrackIndex + 1);
        });

        prevBtn.addEventListener('click', () => {
            playTrack(currentTrackIndex - 1);
        });

        volumeControl.addEventListener('input', () => {
            audioPlayer.volume = volumeControl.value;
        });
    }
        
            // To-Do List functionality
            function loadTodoList() {
                const todoInput = document.getElementById('todo-input');
                const addTodoBtn = document.getElementById('add-todo-btn');
                const todoList = document.getElementById('todo-list');
        
                let todos = JSON.parse(localStorage.getItem('todos')) || [];
                renderTodoList();
        
                addTodoBtn.addEventListener('click', () => {
                    const newTodoText = todoInput.value.trim();
                    if (newTodoText !== '') {
                        const newTodo = { text: newTodoText, completed: false };
                        todos.push(newTodo);
                        localStorage.setItem('todos', JSON.stringify(todos));
                        todoInput.value = '';
                        renderTodoList();
                    }
                });
        
                function renderTodoList() {
                    todoList.innerHTML = '';
                    todos.forEach((todo, index) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = todo.text;
                        if (todo.completed) {
                            listItem.classList.add('completed');
                        }
        
                        listItem.addEventListener('click', () => {
                            todos[index].completed = !todos[index].completed;
                            localStorage.setItem('todos', JSON.stringify(todos));
                            renderTodoList();
                        });
        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.addEventListener('click', () => {
                            todos.splice(index, 1);
                            localStorage.setItem('todos', JSON.stringify(todos));
                            renderTodoList();
                        });
                        listItem.appendChild(deleteBtn);
        
                        todoList.appendChild(listItem);
                    });
                }
            }
        
            // Image Gallery functionality
            function loadGallery() {
                const galleryContainer = document.getElementById('gallery-container');
                const imageUpload = document.getElementById('image-upload');
        
                let images = JSON.parse(localStorage.getItem('images')) || [];
        
                renderGallery();
                updateTitleImage();
        
                imageUpload.addEventListener('change', (event) => {
                    const files = event.target.files;
                    for (const file of files) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            images.push(e.target.result);
                            localStorage.setItem('images', JSON.stringify(images));
                            renderGallery();
                        };
                        reader.readAsDataURL(file);
                    }
                });
        
                galleryContainer.addEventListener('click', (event) => {
                    if (event.target.tagName === 'IMG') {
                        titleImageSrc = event.target.src;
                        localStorage.setItem('titleImageSrc', titleImageSrc);
                        updateTitleImage();
                    }
                });
        
                removeTitleImageBtn.addEventListener('click', () => {
                    titleImageSrc = null;
                    localStorage.removeItem('titleImageSrc');
                    updateTitleImage();
                });
        
                function renderGallery() {
                    galleryContainer.innerHTML = '';
                    images.forEach(imageSrc => {
                        const imgElement = document.createElement('img');
                        imgElement.src = imageSrc;
                        imgElement.alt = 'Uploaded Image';
                        galleryContainer.appendChild(imgElement);
                    });
                }
            }
        
            // Title Image handling
            function updateTitleImage() {
                if (titleImageSrc) {
                    titleImage.src = titleImageSrc;
                    titleImage.style.display = 'block';
                    removeTitleImageBtn.style.display = 'block';
                } else {
                    titleImage.src = '';
                    titleImage.style.display = 'none';
                    removeTitleImageBtn.style.display = 'none';
                }
            }
        
            // Initial navigation
            navigateTo('home'); 
        });