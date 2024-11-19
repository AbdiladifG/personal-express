const trash = document.getElementsByClassName("fa-trash");
const checkboxes = document.getElementsByClassName("workout-check");

Array.from(checkboxes).forEach(function(element) {
    element.addEventListener('click', function() {
        const exercise = this.parentNode.childNodes[3].innerText;
        const sets = this.parentNode.childNodes[5].innerText.split(' ')[0];
        const reps = this.parentNode.childNodes[7].innerText.split(' ')[0];
        const completed = this.checked;

        fetch('/toggleComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'exercise': exercise,
                'sets': sets,
                'reps': reps,
                'completed': completed
            })
        })
        .then(response => {
            if (response.ok) return response.json();
        })
        .then(data => {
            console.log(data);
            window.location.reload();
        });
    });
});

Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function() {
        const exercise = this.parentNode.parentNode.childNodes[3].innerText;
        const sets = this.parentNode.parentNode.childNodes[5].innerText.split(' ')[0];
        const reps = this.parentNode.parentNode.childNodes[7].innerText.split(' ')[0];

        fetch('/deleteWorkout', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'exercise': exercise,
                'sets': sets,
                'reps': reps
            })
        })
        .then(function(response) {
            window.location.reload();
        });
    });
});