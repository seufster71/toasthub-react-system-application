import reducerUtils from '../../core/common/reducer-utils';

export default function applicationReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'LOAD_INIT_APPLICATIONS': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
					prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
					prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
					columns: reducerUtils.getColumns(action),
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					selected: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'LOAD_LIST_APPLICATIONS': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					selected: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'APPLICATIONS_APPLICATION': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				for (let i = 0; i < prefForms.ADMIN_LANGUAGE_FORM.length; i++) {
					let classModel = JSON.parse(prefForms.ADMIN_LANGUAGE_FORM[i].classModel);
					if (action.responseJson.params.item != null && action.responseJson.params.item[classModel.field]) {
						inputFields[prefForms.ADMIN_LANGUAGE_FORM[i].name] = action.responseJson.params.item[classModel.field];
					} else {
						let result = "";
						if (prefForms.ADMIN_LANGUAGE_FORM[i].value != null && prefForms.ADMIN_LANGUAGE_FORM[i].value != ""){
							let formValue = JSON.parse(prefForms.ADMIN_LANGUAGE_FORM[i].value);
							for (let j = 0; j < formValue.options.length; j++) {
								if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
									result = formValue.options[j].value;
								}
							}
						}
						inputFields[prefForms.ADMIN_LANGUAGE_FORM[i].name] = result;
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.ID = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selectedUser : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'APPLICATIONS_INPUT_CHANGE': {
			if (action.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields[action.params.field] = action.params.value;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
		        return state;
		    }
		}
		default:
			return state;
	}
}

