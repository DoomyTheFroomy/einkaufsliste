document.querySelector('#artikelForm').addEventListener('keyup', toggleButton)
document.querySelector('#artikelForm').addEventListener('change', toggleButton)
document.querySelector('#artikelForm').addEventListener('submit', handleFormSubmit)
document.querySelector('#tableTail').addEventListener('click', handleRowClick)

function toggleButton (e) {
  var form = this
  var allFieldsNotEmpty = true
  var button = form.querySelector('#input-absenden')

  // Select all input fields
  var inputArtikel = form.querySelector('#artikel-eingeben')
  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  var inputMenge = form.querySelector('#menge-eingeben')

  // Read values from fields
  var values = []
  values.push(inputArtikel.value)
  var einheit = selectEinheit.children[selectEinheit.selectedIndex].value
  values.push(einheit)
  values.push(inputMenge.value)

  // Check if all fields are filled
  for (var i = 0; i < values.length; i++) {
    if (values[i].length === 0) {
      allFieldsNotEmpty = false
      break
    }
  }

  // Activate or deactivate button
  if (allFieldsNotEmpty) {
    button.removeAttribute('disabled')
  } else {
    button.setAttribute('disabled', 'disabled')
  }
}

function createNewRow (artikel, einheit, menge) {
  // Create new row with values
  var newRow = document.createElement('div')
  newRow.classList.add('row')

  var newCheckbox = document.createElement('input')
  newCheckbox.setAttribute('type', 'checkbox')
  newCheckbox.classList.add('checkbox')
  newRow.appendChild(newCheckbox)

  var newArtikel = document.createElement('div')
  newArtikel.classList.add('artikel')
  newArtikel.textContent = artikel
  newRow.appendChild(newArtikel)

  var newEinheit = document.createElement('div')
  newEinheit.classList.add('einheit')
  newEinheit.textContent = einheit
  newRow.appendChild(newEinheit)

  var newMenge = document.createElement('div')
  newMenge.classList.add('menge')
  newMenge.textContent = menge
  newRow.appendChild(newMenge)

  var newEditButton = document.createElement('i')
  newEditButton.classList.add('fa', 'fa-pencil')
  newEditButton.setAttribute('data-type', 'edit')
  newRow.appendChild(newEditButton)

  var newDeleteButton = document.createElement('i')
  newDeleteButton.classList.add('fa', 'fa-trash')
  newDeleteButton.setAttribute('data-type', 'delete')
  newRow.appendChild(newDeleteButton)

  return newRow
}

function handleFormSubmit (e) {
  // Verhindern des Absenden und Neuladen durch den Browser
  e.preventDefault()
    // Container for new table rows
  var table = document.querySelector('#tableTail')

  // Extracting user data from fields
  var form = this // Wir sitzen auf dem Form
  var artikel = form.querySelector('#artikel-eingeben').value

  // DOM-Node = 'select' (HTML-Code)
  var selectEinheit = form.querySelector('#einheit-auswaehlen')
    // DOM-Nodes = 'options' (HTML-Code)
  var options = selectEinheit.children
    // Currently selected index of 'options'
  var selectedIndex = selectEinheit.selectedIndex
    // Read value from selected option tag
  var einheit = options[selectedIndex].value

  var menge = form.querySelector('#menge-eingeben').value
    // Creating new table row (invisible)

  var newRow = createNewRow(artikel, einheit, menge)
    // Appending new row to existing container (visible)
  table.appendChild(newRow)
    // Clearing input fields
  form.reset()
    // Set cursor into first input field
  form.querySelector('#artikel-eingeben').focus()
}

function handleRowClick (e) {
  var tableTail = this
  var button = e.srcElement
    // Wenns nicht der Klick auf den Button war:
  if (!button) return
    // If source element is 'Delete' button (data-type="delete")
    // https://wiki.selfhtml.org/wiki/Data-Attribut
  if (button.dataset.type === 'delete') {
    var row = getRowOfButton(button)
    if (row) queryDelete(tableTail, row)

    // deleteRow(tableTail, row)
  }
  // If source element is 'Edit' button
  if (button.dataset.type === 'edit') {
    var row = getRowOfButton(button)
    if (row) {
      var values = getValuesFromRow(row)
        // Name für neue Funktion wählen und aufrufen
      insertValuesIntoForm(values)
        // Entfernen der Row, damit sie nach dem Editieren nicht doppelt vorhanden ist
      deleteRow(tableTail, row)
    }
  }

  // Else do nothing
  // möglich wäre 'return' - aber unnötig
}

function queryDelete (tableTail, row) {
  var query = window.confirm('Eintrag wirklich löschen?')
  if (query === true) {
    deleteRow(tableTail, row)
  }
}

function deleteRow (tableTail, row) {
  tableTail.removeChild(row)
}

function insertValuesIntoForm (values) {
  var form = document.querySelector('#artikelForm')
  var inputArtikel = form.querySelector('#artikel-eingeben')
  inputArtikel.value = values[0]

  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  var options = selectEinheit.querySelectorAll('option')
  var einheit = values[1]

  for (var i = 0; i < options.length; i++) {
    var optionNode = options[i]
    var optionValue = optionNode.getAttribute('value')
      //
    if (einheit === optionValue) {
      selectEinheit.selectedIndex = i
      break
    }
  }

  var inputMenge = form.querySelector('#menge-eingeben')
  inputMenge.value = values[2]
}

function getValuesFromRow (row) {
  // Wenn die Row leer ist, steige aus
  if (row === undefined) return

  // artikelNode  = selektiere DOM-Node '.artikel' (ROW!!!)
  // Mit document.querySelector gäbe es immer nur die erste Zeile im DOM zurück
  var artikelNode = row.querySelector('.artikel')
  var artikel = artikelNode.textContent

  // ODER: (Function Chaining)
  var einheit = row.querySelector('.einheit').textContent

  var mengeNode = row.querySelector('.menge')
  var menge = mengeNode.textContent

  // Gib die Werte der Variablen zurück
  return [artikel, einheit, menge]
}

function getRowOfButton (button) {
  if (button.parentNode && button.parentNode.classList.contains('row')) {
    return button.parentNode
  } else {
    return undefined
  }
}
