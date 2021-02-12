/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as applicationActions from './application-actions';
import fuLogger from '../../core/common/fu-logger';
import ApplicationView from '../../systemView/application/application-view';
import ApplicationModifyView from '../../systemView/application/application-modify-view';
import utils from '../../core/common/utils';

/*
* Application Page
*/
class ApplicationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_APPLICATION",orderCriteria:[{'orderColumn':'ADMIN_APPLICATION_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_APPLICATION_TABLE_CODE','orderDir':'ASC'}],
			isDeleteModalOpen: false, errors:null, warns:null, successes:null};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onModify = this.onModify.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentDidMount() {
		this.props.actions.init();
	}

	onListLimitChange(fieldName) {
		return (event) => {
			let value = 20;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
				this.setState({[fieldName]:parseInt(event.nativeEvent.text)});
			} else {
				value = event.target.value;
				this.setState({[fieldName]:parseInt(event.target.value)});
			}

			let listStart = 0;
			let listLimit = parseInt(value);
			let searchCriteria = {'searchValue':this.state['ADMIN_APPLICATION_SEARCH_input'],'searchColumn':'ADMIN_APPLICATION_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'ApplicationContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_APPLICATION_ListLimit');
			let listStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_APPLICATION_PAGINATION"] != null && this.state["ADMIN_APPLICATION_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_APPLICATION_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_APPLICATION_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_APPLICATION_SEARCH_input'],'searchColumn':'ADMIN_APPLICATION_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onSearchChange(fieldName) {
		return (event) => {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		};
	}

	onSearchClick(e) {
		return (event) => {
			let fieldName = "";
			if (this.props.codeType === 'NATIVE') {
				fieldName = e;
			} else {
				event.preventDefault();
				fieldName = event.target.id;
			}
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_APPLICATION_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_APPLICATION_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ApplicationContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ApplicationContainer::onSave',msg:"test"});
			let errors = utils.validateFormFields(this.props.applications.prefForms.ADMIN_APPLICATION_FORM, this.props.applications.inputFields, this.props.appPrefs.prefGlobal.APPLICATIONS);
			
			if (errors.isValid){
				let searchCriteria = {'searchValue':this.state['ADMIN_APPLICATION_SEARCH_input'],'searchColumn':'ADMIN_APPLICATION_TABLE_NAME'};
				this.props.actions.saveApplication(this.props.applications.inputFields,this.props.applications.listStart,this.props.applications.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				this.setState({errors:errors.errorMap});
			}
		};
	}
	
	onModify(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ApplicationContainer::onModify',msg:"test"+id});
			this.props.actions.application(id);
		};
	}
	
	onDelete(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ApplicationContainer::onDelete',msg:"test"+id});
			this.setState({isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['ADMIN_APPLICATION_SEARCH_input'],'searchColumn':'ADMIN_APPLICATION_TABLE_NAME'};
			this.props.actions.deleteApplication(id,this.props.applications.listStart,this.props.applications.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedId:id,selectedName:name});
		}
	}
	
	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}
	
	onCancel() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ApplicationContainer::onCancel',msg:"test"});
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_APPLICATION_ListLimit');
			let searchCriteria = {'searchValue':this.state['ADMIN_APPLICATION_SEARCH_input'],'searchColumn':'ADMIN_APPLICATION_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	inputChange(fieldName) {
		return (event) => {
			let	value = null;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
			} else {
				value = event.target.value;
			}
			if (switchValue != null) {
				value = switchValue;
			}
			this.props.actions.inputChange(fieldName,value);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'ApplicationContainer::render',msg:"Hi there"});
		if (this.props.applications.isModifyOpen) {
			return (
				<ApplicationModifyView
				containerState={this.state}
				item={this.props.applications.selected}
				inputFields={this.props.applications.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.applications.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.applications.items != null) {
			return (
				<ApplicationView 
				containerState={this.state}
				applications={this.props.applications}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onModify={this.onModify}
				onDelete={this.onDelete}
				inputChange={this.inputChange}
				/>	
			);
		} else {
			return (<div> Loading... </div>);
		}
	}
}

ApplicationContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	applications: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, applications:state.applications};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(applicationActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(ApplicationContainer);
