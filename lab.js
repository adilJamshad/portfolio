const chatModel = document.querySelector('#chat-model');
const embeddingModel = document.querySelector('#embedding-model');
const rebuild = document.querySelector('#rebuild-index');
const queryEngine = document.querySelector('#query-engine');
const indexEngine = document.querySelector('#index-engine');
const answerEngine = document.querySelector('#answer-engine');
const indexNode = document.querySelector('#index-node');
const labStatus = document.querySelector('.lab-status');
const labMessage = document.querySelector('#lab-message');
let indexedWith = embeddingModel.value;

function updateLab(event) {
  const embeddingName = embeddingModel.selectedOptions[0].textContent;
  const chatName = chatModel.selectedOptions[0].textContent;
  const indexName = [...embeddingModel.options].find(option => option.value === indexedWith).textContent;
  const mismatch = indexedWith !== embeddingModel.value;

  queryEngine.textContent = embeddingName;
  indexEngine.textContent = 'Indexed with ' + indexName;
  answerEngine.textContent = chatName;
  indexNode.classList.toggle('mismatch', mismatch);
  labStatus.classList.toggle('mismatch', mismatch);
  rebuild.disabled = !mismatch;

  if (mismatch) {
    labMessage.textContent = 'Retrieval paused. Rebuild the RFC index with ' + embeddingName + ' to match the question vectors.';
  } else if ((event && event.target) === chatModel) {
    labMessage.textContent = 'Generation now uses ' + chatName + '. The existing ' + indexName + ' index is ready.';
  } else if ((event && event.target) === rebuild) {
    labMessage.textContent = 'Rebuild simulated. The question and RFC section vectors now use ' + indexName + '.';
  } else {
    labMessage.textContent = 'Index ready. Question and RFC section vectors use ' + indexName + '.';
  }
}

chatModel.addEventListener('change', updateLab);
embeddingModel.addEventListener('change', updateLab);
rebuild.addEventListener('click', event => {
  indexedWith = embeddingModel.value;
  updateLab(event);
});
updateLab();

