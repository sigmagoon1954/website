(function(){
  const scaleLabels = ["Tidak pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"];
  const indicatorNames = [
    "Memenuhi Janji",
    "Mensyukuri Nikmat",
    "Memelihara Lisan",
    "Menutup Aib Orang Lain"
  ];

  // Build the 1–5 scale controls for every question
  document.querySelectorAll('.scale').forEach(function(container){
    const q = container.getAttribute('data-q');
    for(let i = 1; i <= 5; i++){
      const id = 'q' + q + '-' + i;
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q' + q;
      input.value = i;
      input.id = id;
      input.required = true;

      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = scaleLabels[i - 1];

      container.appendChild(input);
      container.appendChild(label);
    }
  });

  const form = document.getElementById('quizForm');
  const quizPage = document.getElementById('quizPage');
  const resultsPage = document.getElementById('resultsPage');
  const breakdown = document.getElementById('breakdown');

  function qualifierFor(pct){
    if(pct >= 91) return "Sangat Baik";
    if(pct >= 71) return "Baik";
    if(pct >= 41) return "Sedang Bertumbuh";
    return "Perlu Diperkuat";
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    const indicatorScores = [0, 0, 0, 0];

    for(let ind = 0; ind < 4; ind++){
      let sum = 0;
      for(let q = 0; q < 5; q++){
        const name = 'q' + ind + '-' + q;
        const checked = form.querySelector('input[name="' + name + '"]:checked');
        sum += checked ? parseInt(checked.value, 10) : 0;
      }
      indicatorScores[ind] = Math.round((sum / 25) * 100);
    }

    const overall = Math.round(
      indicatorScores.reduce((a, b) => a + b, 0) / indicatorScores.length
    );

    // Build breakdown rows
    breakdown.innerHTML = '';
    indicatorNames.forEach(function(name, i){
      const row = document.createElement('div');
      row.className = 'bd-row';
      row.innerHTML =
        '<div class="bd-top"><span class="name">' + name + '</span>' +
        '<span class="pct">' + indicatorScores[i] + '%</span></div>' +
        '<div class="bd-bar"><div class="bd-bar-fill" data-target="' + indicatorScores[i] + '"></div></div>';
      breakdown.appendChild(row);
    });

    document.getElementById('overallPct').textContent = overall + '%';
    document.getElementById('overallQualifier').textContent = qualifierFor(overall);
    document.getElementById('overallBar').style.width = '0%';

    // Navigate to the results page
    quizPage.classList.remove('active');
    resultsPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Animate bars after layout settles
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        document.getElementById('overallBar').style.width = overall + '%';
        document.querySelectorAll('.bd-bar-fill').forEach(function(el){
          el.style.width = el.getAttribute('data-target') + '%';
        });
      });
    });
  });

  function backToQuiz(){
    resultsPage.classList.remove('active');
    quizPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  document.getElementById('retryBtn').addEventListener('click', function(){
    form.reset();
    backToQuiz();
  });

  document.getElementById('backLink').addEventListener('click', backToQuiz);
})();