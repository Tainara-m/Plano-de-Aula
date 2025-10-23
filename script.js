document.addEventListener('DOMContentLoaded', function() {
    const els = {
      turma: document.getElementById('turma'),
      bimestre: document.getElementById('bimestre'),
      materia: document.getElementById('materia'),
      professor: document.getElementById('professor'),
      anoLetivo: document.getElementById('anoLetivo'),
      numSemanas: document.getElementById('numSemanas'),
      aulasPorSemana: document.getElementById('aulasPorSemana'),
      btnGerar: document.getElementById('btnGerar'),
      weeksContainer: document.getElementById('weeksContainer'),
      resSemanas: document.getElementById('resSemanas'),
      resAulasSemana: document.getElementById('resAulasSemana'),
      resTotalAulas: document.getElementById('resTotalAulas'),
      btnPDF: document.getElementById('btnPDF'),
      btnExpandir: document.getElementById('btnExpandir'),
      btnRecolher: document.getElementById('btnRecolher'),
      btnSalvar: document.getElementById('btnSalvar'),
      btnLimpar: document.getElementById('btnLimpar'),
      autosaveStatus: document.getElementById('autosaveStatus'),
    };

    const STORAGE_KEY = 'planoDeAula@v1';

    function stateFromUI(){
      const weeks = [...els.weeksContainer.querySelectorAll('.week')].map((w, wi)=>({
        conteudoSemana: w.querySelector('.conteudoSemana').value,
        lessons: [...w.querySelectorAll('.lesson')].map((l, li)=>({
          titulo: l.querySelector('h3').textContent.trim(),
          dataAula: l.querySelector('.dataAula').value,
          conteudoAula: l.querySelector('.conteudoAula').value,
          metodo: l.querySelector('.metodo').value,
          recursos: l.querySelector('.recursos').value,
          objetivos: l.querySelector('.objetivos').value,
        }))
      }));
      return {
        turma: els.turma.value,
        bimestre: els.bimestre.value,
        materia: els.materia.value,
        professor: els.professor.value,
        anoLetivo: els.anoLetivo.value,
        numSemanas: +els.numSemanas.value || 0,
        aulasPorSemana: +els.aulasPorSemana.value || 0,
        weeks,
      };
    }

    function applyState(state){
      els.turma.value = state.turma || '';
      els.bimestre.value = state.bimestre || '';
      els.materia.value = state.materia || '';
      els.professor.value = state.professor || '';
      els.anoLetivo.value = state.anoLetivo || '';
      els.numSemanas.value = state.numSemanas || 1;
      els.aulasPorSemana.value = state.aulasPorSemana || 2;
      renderWeeks(state.numSemanas, state.aulasPorSemana, state.weeks);
      updateResumo();
    }

    function save(){
      try {
        const data = stateFromUI();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        pingSaved();
        return true;
      } catch (error) {
        console.error('Erro ao salvar:', error);
        showSaveError();
        return false;
      }
    }

    let saveTimer;
    let lastSavedData = '';
    let hasUnsavedChanges = false;
    
    function autoSave(){
      clearTimeout(saveTimer);
      hasUnsavedChanges = true;
      
      saveTimer = setTimeout(() => {
        // Só salva se houve mudanças
        const currentData = JSON.stringify(stateFromUI());
        if (currentData !== lastSavedData) {
          if (save()) {
            lastSavedData = currentData;
            hasUnsavedChanges = false;
          }
        } else {
          hasUnsavedChanges = false;
          els.autosaveStatus.textContent = 'Nenhuma alteração';
          els.autosaveStatus.style.color = '#7f8c8d';
        }
      }, 300);
      setSaving();
    }

    function checkForUnsavedChanges() {
      const currentData = JSON.stringify(stateFromUI());
      hasUnsavedChanges = currentData !== lastSavedData;
      
      if (hasUnsavedChanges) {
        els.autosaveStatus.textContent = 'Alterações pendentes...';
        els.autosaveStatus.style.color = '#f39c12';
      }
      
      return hasUnsavedChanges;
    }

    function forceSave() {
      clearTimeout(saveTimer);
      return save();
    }

    function setSaving(){
      els.autosaveStatus.textContent = 'Salvando…';
      els.autosaveStatus.style.color = '#f39c12';
    }
    
    function pingSaved(){
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      els.autosaveStatus.textContent = `Auto‑salvo ${time}`;
      els.autosaveStatus.style.color = '#27ae60';
      els.autosaveStatus.title = `Última alteração salva em ${time}`;
      setTimeout(() => {
        if (els.autosaveStatus.textContent.includes('Auto‑salvo')) {
          els.autosaveStatus.style.color = '#7f8c8d';
        }
      }, 3000);
    }

    function showSaveError(){
      els.autosaveStatus.textContent = 'Erro ao salvar';
      els.autosaveStatus.style.color = '#e74c3c';
    }

    function renderWeeks(qtd, aulas, previousWeeks){
      els.weeksContainer.innerHTML = '';
      const wtpl = document.getElementById('weekTemplate');
      const ltpl = document.getElementById('lessonTemplate');

      for(let i=0;i<qtd;i++){
        const w = wtpl.content.cloneNode(true);
        const wEl = w.querySelector('.week');
        wEl.querySelector('.wIndex').textContent = i+1;
        const lessonsEl = wEl.querySelector('.lessons');

        for(let j=0;j<aulas;j++){
          const l = ltpl.content.cloneNode(true);
          const lessonEl = l.querySelector('.lesson');
          const h3 = l.querySelector('h3');
          h3.textContent = `Aula ${j+1}`;
          
          // Adicionar funcionalidade de clique para expandir/recolher
          h3.style.cursor = 'pointer';
          h3.addEventListener('click', () => {
            const grids = lessonEl.querySelectorAll('.grid');
            const objetivosTextarea = lessonEl.querySelector('.objetivos');
            const objetivosDiv = objetivosTextarea ? objetivosTextarea.parentElement : null;
            const isCollapsed = lessonEl.classList.contains('collapsed');
            
            if (isCollapsed) {
              // Expandir
              grids.forEach(grid => grid.style.display = 'grid');
              
              // Restaurar layout da segunda linha
              const secondGrid = grids[1];
              if (secondGrid) {
                const conteudoDiv = secondGrid.children[0];
                const recursosDiv = secondGrid.children[1];
                if (conteudoDiv) conteudoDiv.style.gridColumn = '';
                if (recursosDiv) recursosDiv.style.display = '';
              }
              
              if (objetivosDiv) objetivosDiv.style.display = 'block';
              lessonEl.classList.remove('collapsed');
            } else {
              // Recolher - mostrar apenas conteúdo da aula
              const firstGrid = grids[0];
              if (firstGrid) firstGrid.style.display = 'none';
              
              const secondGrid = grids[1];
              if (secondGrid) {
                const recursosDiv = secondGrid.children[1];
                const conteudoDiv = secondGrid.children[0];
                if (recursosDiv) recursosDiv.style.display = 'none';
                if (conteudoDiv) conteudoDiv.style.gridColumn = '1 / -1';
              }
              
              if (objetivosDiv) objetivosDiv.style.display = 'none';
              lessonEl.classList.add('collapsed');
            }
          });
          
          lessonsEl.appendChild(l);
        }

        // restaurar dados, se houver
        const prev = previousWeeks && previousWeeks[i];
        if(prev){
          wEl.querySelector('.conteudoSemana').value = prev.conteudoSemana || '';
          prev.lessons?.forEach((ldata, idx)=>{
            const lEl = lessonsEl.children[idx];
            if(!lEl) return;
            lEl.querySelector('.dataAula').value = ldata.dataAula || '';
            lEl.querySelector('.conteudoAula').value = ldata.conteudoAula || '';
            lEl.querySelector('.metodo').value = ldata.metodo || '';
            lEl.querySelector('.recursos').value = ldata.recursos || '';
            lEl.querySelector('.objetivos').value = ldata.objetivos || '';
          });
        }

        // ações da semana
        wEl.querySelector('.btnRemover').addEventListener('click', ()=>{
          wEl.remove();
          renumerarSemanas();
          updateResumo();
          autoSave();
        });
        wEl.querySelector('.btnDuplicar').addEventListener('click', ()=>{
          const snapshot = snapshotWeek(wEl);
          const qtdAtual = els.weeksContainer.children.length;
          const cloneState = [...collectWeeksState(), snapshot];
          renderWeeks(qtdAtual+1, aulas, cloneState);
          autoSave();
        });

        els.weeksContainer.appendChild(w);
      }

      bindInputsForAutosave();
    }

    function collectWeeksState(){
      return [...els.weeksContainer.querySelectorAll('.week')].map(w=>({
        conteudoSemana: w.querySelector('.conteudoSemana').value,
        lessons: [...w.querySelectorAll('.lesson')].map(l=>({
          dataAula: l.querySelector('.dataAula').value,
          conteudoAula: l.querySelector('.conteudoAula').value,
          metodo: l.querySelector('.metodo').value,
          recursos: l.querySelector('.recursos').value,
          objetivos: l.querySelector('.objetivos').value,
        }))
      }));
    }

    function snapshotWeek(wEl){
      return {
        conteudoSemana: wEl.querySelector('.conteudoSemana').value,
        lessons: [...wEl.querySelectorAll('.lesson')].map(l=>({
          dataAula: l.querySelector('.dataAula').value,
          conteudoAula: l.querySelector('.conteudoAula').value,
          metodo: l.querySelector('.metodo').value,
          recursos: l.querySelector('.recursos').value,
          objetivos: l.querySelector('.objetivos').value,
        }))
      };
    }

    function renumerarSemanas(){
      [...els.weeksContainer.querySelectorAll('.wIndex')].forEach((el,i)=>el.textContent=i+1);
    }

    function bindInputsForAutosave(){
      els.weeksContainer.querySelectorAll('input,select,textarea').forEach(el=>{
        // Eventos de entrada de texto
        el.addEventListener('input', autoSave);
        el.addEventListener('change', autoSave);
        el.addEventListener('blur', autoSave);
        
        // Eventos de teclado específicos
        el.addEventListener('keydown', (e) => {
          // Salva imediatamente em algumas teclas importantes
          if (e.key === 'Tab' || e.key === 'Enter') {
            setTimeout(autoSave, 100);
          }
        });
        
        // Para textareas, salva quando para de digitar por um tempo
        if (el.tagName === 'TEXTAREA') {
          let textTimer;
          el.addEventListener('input', () => {
            clearTimeout(textTimer);
            textTimer = setTimeout(autoSave, 1000); // Salva após 1s sem digitar
          });
        }
      });
    }

    function updateResumo(){
      const semanas = els.weeksContainer.children.length;
      const aulas = +els.aulasPorSemana.value || 0;
      els.resSemanas.textContent = semanas;
      els.resAulasSemana.textContent = aulas;
      els.resTotalAulas.textContent = semanas * aulas;
    }

    // Botões principais
    els.btnGerar.addEventListener('click', ()=>{
      const weeksState = collectWeeksState();
      renderWeeks(+els.numSemanas.value || 0, +els.aulasPorSemana.value || 0, weeksState);
      updateResumo();
      autoSave();
    });

    els.btnPDF.addEventListener('click', ()=>{
      generateCleanPDF();
    });

    els.btnSalvar.addEventListener('click', ()=>{
      els.btnSalvar.textContent = '💾 Salvando...';
      els.btnSalvar.disabled = true;
      
      setTimeout(() => {
        if (forceSave()) {
          els.btnSalvar.textContent = '✅ Salvo!';
          els.btnSalvar.style.background = '#27ae60';
          els.btnSalvar.style.color = 'white';
        } else {
          els.btnSalvar.textContent = '❌ Erro';
          els.btnSalvar.style.background = '#e74c3c';
          els.btnSalvar.style.color = 'white';
        }
        
        setTimeout(() => {
          els.btnSalvar.textContent = '💾 Salvar';
          els.btnSalvar.style.background = '';
          els.btnSalvar.style.color = '';
          els.btnSalvar.disabled = false;
        }, 2000);
      }, 100);
    });

    els.btnExpandir.addEventListener('click', ()=>{
      document.querySelectorAll('.lesson').forEach(lesson => {
        // Mostrar todas as grids
        const grids = lesson.querySelectorAll('.grid');
        grids.forEach(grid => grid.style.display = 'grid');
        
        // Restaurar layout da segunda linha
        const secondGrid = lesson.querySelectorAll('.grid')[1];
        if (secondGrid) {
          const conteudoDiv = secondGrid.children[0];
          const recursosDiv = secondGrid.children[1];
          if (conteudoDiv) conteudoDiv.style.gridColumn = ''; // Restaurar layout normal
          if (recursosDiv) recursosDiv.style.display = ''; // Mostrar recursos novamente
        }
        
        // Mostrar objetivos - busca mais específica
        const objetivosTextarea = lesson.querySelector('.objetivos');
        if (objetivosTextarea) {
          const objetivosDiv = objetivosTextarea.parentElement;
          if (objetivosDiv) objetivosDiv.style.display = 'block';
        }
        
        lesson.classList.remove('collapsed');
      });
    });
    els.btnRecolher.addEventListener('click', ()=>{
      document.querySelectorAll('.lesson').forEach(lesson => {
        // Ocultar primeira linha (data + forma de ensinar)
        const firstGrid = lesson.querySelector('.grid');
        if (firstGrid) firstGrid.style.display = 'none';
        
        // Ocultar apenas o campo recursos da segunda linha, manter conteúdo visível
        const secondGrid = lesson.querySelectorAll('.grid')[1];
        if (secondGrid) {
          const recursosDiv = secondGrid.children[1]; // Segunda div (recursos)
          if (recursosDiv) recursosDiv.style.display = 'none';
          // Fazer o conteúdo ocupar toda a linha
          const conteudoDiv = secondGrid.children[0]; // Primeira div (conteúdo)
          if (conteudoDiv) {
            conteudoDiv.style.gridColumn = '1 / -1'; // Ocupar toda a linha
          }
        }
        
        // Ocultar objetivos quando recolhido - busca mais específica
        const objetivosTextarea = lesson.querySelector('.objetivos');
        if (objetivosTextarea) {
          const objetivosDiv = objetivosTextarea.parentElement;
          if (objetivosDiv) objetivosDiv.style.display = 'none';
        }
        
        lesson.classList.add('collapsed');
      });
    });

    els.btnLimpar.addEventListener('click', ()=>{
      if(confirm('Limpar todos os campos do plano?')){
        localStorage.removeItem(STORAGE_KEY);
        applyState({ turma:'', bimestre:'', materia:'', professor:'', anoLetivo:'', numSemanas:1, aulasPorSemana:2, weeks:[] });
      }
    });

    function generateCleanPDF() {
      // Criar uma nova janela com conteúdo limpo
      const printWindow = window.open('', '_blank');
      const state = stateFromUI();
      
      let content = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Plano de Aula - ${escapeHtml(state.materia || 'Disciplina')} - ${escapeHtml(state.turma || 'Turma')}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      font-size: 12px;
      max-width: 800px; 
      margin: 15px auto; 
      padding: 15px; 
      line-height: 1.4;
      color: #333;
    }
    h1 { 
      text-align: center; 
      color: #2c3e50; 
      font-size: 18px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }
    h2 { 
      color: #34495e; 
      font-size: 14px;
      margin: 20px 0 10px 0;
      border-left: 3px solid #3498db;
      padding-left: 10px;
    }
    h3 { 
      color: #2980b9; 
      font-size: 13px;
      margin: 15px 0 8px 0;
    }
    .info-header { 
      border: 1px solid #ddd;
      padding: 12px; 
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      font-size: 12px;
    }
    .info-item { 
      margin-bottom: 3px; 
    }
    .info-item strong { 
      color: #2c3e50; 
    }
    .week-content { 
      border: 1px solid #ddd; 
      padding: 10px; 
      margin: 12px 0;
      font-size: 12px;
    }
    .lesson { 
      border: 1px solid #ddd; 
      padding: 12px; 
      margin: 10px 0;
      page-break-inside: avoid;
    }
    .lesson-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .lesson-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .lesson-field { 
      margin-bottom: 6px; 
      font-size: 12px;
    }
    .lesson-field strong { 
      color: #2c3e50;
      font-weight: bold;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    @media print {
      body { margin: 0; padding: 10px; font-size: 12px; }
      .week-content { page-break-inside: avoid; }
      .lesson { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>PLANO DE AULA</h1>
  
  <div class="info-header">`;

      // Informações do cabeçalho - apenas se preenchidas
      if (state.materia) content += `<div class="info-item"><strong>Matéria:</strong> ${escapeHtml(state.materia)}</div>`;
      if (state.turma) content += `<div class="info-item"><strong>Turma:</strong> ${escapeHtml(state.turma)}</div>`;
      if (state.bimestre) content += `<div class="info-item"><strong>Bimestre:</strong> ${escapeHtml(state.bimestre)}</div>`;
      if (state.professor) content += `<div class="info-item"><strong>Professor(a):</strong> ${escapeHtml(state.professor)}</div>`;
      if (state.anoLetivo) content += `<div class="info-item"><strong>Ano Letivo:</strong> ${escapeHtml(state.anoLetivo)}</div>`;
      if (state.aulasPorSemana) content += `<div class="info-item"><strong>Aulas por Semana:</strong> ${state.aulasPorSemana}</div>`;

      content += `</div>`;

      // Percorrer semanas e aulas - apenas com conteúdo
      state.weeks.forEach((week, weekIndex) => {
        const hasWeekContent = week.conteudoSemana && week.conteudoSemana.trim();
        const hasLessonsWithContent = week.lessons.some(lesson => 
          (lesson.dataAula && lesson.dataAula.trim()) ||
          (lesson.conteudoAula && lesson.conteudoAula.trim()) ||
          (lesson.metodo && lesson.metodo.trim()) ||
          (lesson.recursos && lesson.recursos.trim()) ||
          (lesson.objetivos && lesson.objetivos.trim())
        );

        if (hasWeekContent || hasLessonsWithContent) {
          content += `<h2>Semana ${weekIndex + 1}</h2>`;
          
          if (hasWeekContent) {
            content += `<div class="week-content">
              <strong>Conteúdo da Semana:</strong><br>
              ${escapeHtml(week.conteudoSemana).replace(/\n/g, '<br>')}
            </div>`;
          }

          week.lessons.forEach((lesson, lessonIndex) => {
            const hasContent = 
              (lesson.dataAula && lesson.dataAula.trim()) ||
              (lesson.conteudoAula && lesson.conteudoAula.trim()) ||
              (lesson.metodo && lesson.metodo.trim()) ||
              (lesson.recursos && lesson.recursos.trim()) ||
              (lesson.objetivos && lesson.objetivos.trim());

            if (hasContent) {
              let aulaTitle = `Aula ${lessonIndex + 1}`;
              if (lesson.dataAula && lesson.dataAula.trim()) {
                const dataFormatada = new Date(lesson.dataAula + 'T00:00:00').toLocaleDateString('pt-BR');
                aulaTitle += ` - ${dataFormatada}`;
              }
              
              content += `<div class="lesson">
                <h3>${aulaTitle}</h3>`;

              // Primeira linha: Data e Metodologia (se existirem)
              const hasDateOrMethod = (lesson.dataAula && lesson.dataAula.trim()) || (lesson.metodo && lesson.metodo.trim());
              if (hasDateOrMethod) {
                content += `<div class="lesson-header">`;
                if (lesson.dataAula && lesson.dataAula.trim()) {
                  const dataFormatada = new Date(lesson.dataAula + 'T00:00:00').toLocaleDateString('pt-BR');
                  content += `<div class="lesson-field"><strong>Data:</strong> ${dataFormatada}</div>`;
                } else {
                  content += `<div></div>`;
                }
                if (lesson.metodo && lesson.metodo.trim()) {
                  content += `<div class="lesson-field"><strong>Metodologia:</strong> ${escapeHtml(lesson.metodo)}</div>`;
                } else {
                  content += `<div></div>`;
                }
                content += `</div>`;
              }

              // Segunda linha: Conteúdo e Recursos
              const hasContentOrResources = (lesson.conteudoAula && lesson.conteudoAula.trim()) || (lesson.recursos && lesson.recursos.trim());
              if (hasContentOrResources) {
                content += `<div class="lesson-content">`;
                if (lesson.conteudoAula && lesson.conteudoAula.trim()) {
                  content += `<div class="lesson-field"><strong>Conteúdo:</strong><br>${escapeHtml(lesson.conteudoAula).replace(/\n/g, '<br>')}</div>`;
                } else {
                  content += `<div></div>`;
                }
                if (lesson.recursos && lesson.recursos.trim()) {
                  content += `<div class="lesson-field"><strong>Recursos:</strong><br>${escapeHtml(lesson.recursos).replace(/\n/g, '<br>')}</div>`;
                } else {
                  content += `<div></div>`;
                }
                content += `</div>`;
              }

              // Terceira linha: Objetivos (linha inteira)
              if (lesson.objetivos && lesson.objetivos.trim()) {
                content += `<div class="lesson-field full-width"><strong>Objetivos:</strong><br>${escapeHtml(lesson.objetivos).replace(/\n/g, '<br>')}</div>`;
              }

              content += `</div>`;
            }
          });
        }
      });

      if (!content.includes('<h2>')) {
        content += `<div style="text-align: center; margin-top: 50px; color: #7f8c8d;">
          <p><strong>Nenhum conteúdo foi adicionado ainda.</strong></p>
          <p>Preencha as informações do plano de aula para gerar o PDF.</p>
        </div>`;
      }

      content += `</body></html>`;

      printWindow.document.write(content);
      printWindow.document.close();
      
      // Aguardar carregamento e imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
    }

    function addPrintHeader(){
      const header = document.createElement('div');
      header.id = 'printHeader';
      header.style.padding = '16px';
      header.style.borderBottom = '1px solid #bbb';
      header.style.marginBottom = '12px';
      header.style.background = 'white';
      header.style.color = 'black';
      header.innerHTML = `
        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:14px">
          <div><strong>Turma:</strong> ${escapeHtml(els.turma.value||'-')}</div>
          <div><strong>Bimestre:</strong> ${escapeHtml(els.bimestre.value||'-')}</div>
          <div><strong>Matéria:</strong> ${escapeHtml(els.materia.value||'-')}</div>
          <div><strong>Professor(a):</strong> ${escapeHtml(els.professor.value||'-')}</div>
          <div><strong>Ano:</strong> ${escapeHtml(els.anoLetivo.value||'-')}</div>
          <div><strong>Aulas/semana:</strong> ${escapeHtml(els.aulasPorSemana.value||'-')}</div>
        </div>`;
      const container = document.querySelector('.app');
      container.parentNode.insertBefore(header, container);
    }
    function removePrintHeader(){
      const h = document.getElementById('printHeader');
      if(h) h.remove();
    }
    function escapeHtml(str){
      return String(str).replace(/[&<>"]/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
    }

    // Salvamento preventivo antes de sair da página
    window.addEventListener('beforeunload', (e) => {
      if (forceSave()) {
        // Não mostra alerta se salvou com sucesso
      } else {
        e.preventDefault();
        e.returnValue = 'Há alterações não salvas. Deseja realmente sair?';
        return 'Há alterações não salvas. Deseja realmente sair?';
      }
    });

    // Salvamento periódico automático
    setInterval(() => {
      autoSave();
    }, 30000); // Salva a cada 30 segundos

    // Salvamento quando a página perde o foco
    window.addEventListener('blur', () => {
      setTimeout(forceSave, 100);
    });

    // Atalhos de teclado para salvamento
    document.addEventListener('keydown', (e) => {
      // Ctrl+S para salvar
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        els.btnSalvar.click();
      }
    });

    // Inicialização
    (function init(){
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        try{ 
          const savedData = JSON.parse(raw);
          applyState(savedData); 
          lastSavedData = JSON.stringify(savedData);
          els.autosaveStatus.textContent = 'Dados carregados';
          els.autosaveStatus.style.color = '#27ae60';
        }
        catch{ 
          /* fallback */ 
          renderWeeks(1,2); 
          updateResumo(); 
          els.autosaveStatus.textContent = 'Novo plano';
        }
      }else{
        renderWeeks(1,2);
        updateResumo();
        els.autosaveStatus.textContent = 'Novo plano';
      }
      
      // monitorar alterações de campos principais
      ['change','input','blur'].forEach(ev=>{
        [els.turma, els.bimestre, els.materia, els.professor, els.anoLetivo, els.numSemanas, els.aulasPorSemana]
          .forEach(el=> {
            el.addEventListener(ev, autoSave);
            // Para campos de texto, adiciona salvamento após parar de digitar
            if (el.type === 'text' || el.type === 'number') {
              let fieldTimer;
              el.addEventListener('input', () => {
                clearTimeout(fieldTimer);
                fieldTimer = setTimeout(autoSave, 500);
              });
            }
          });
      });
      
      // Inicializa lastSavedData
      setTimeout(() => {
        lastSavedData = JSON.stringify(stateFromUI());
      }, 100);
    })();

});
