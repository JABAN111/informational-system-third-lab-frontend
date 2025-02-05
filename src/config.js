const API_VERSION = "v1"

export const SERVER_URL = 'http://localhost:8080'

const API_AUTH = `api/${API_VERSION}/auth`
export const LOGIN = `${API_AUTH}/login`
export const CREATE_USER = `${API_AUTH}/create-user`


const API_PERSON = `api/${API_VERSION}/manage/persons`
export const GET_PERSONS = `${SERVER_URL}/${API_PERSON}/persons-names`
export const CREATE_PERSON = `${SERVER_URL}/${API_PERSON}/create-person`
export const DELETE_PERSON = `${SERVER_URL}/${API_PERSON}/delete-person-by-id`
export const UPDATE_PERSON = `${SERVER_URL}/${API_PERSON}/update-person`

const API_STUDY_GROUP = `api/${API_VERSION}/manage/study-groups`
export const GET_ALL_GROUPS = `${SERVER_URL}/${API_STUDY_GROUP}/get-all-groups`
export const UPDATE_GROUPS = `${SERVER_URL}/${API_STUDY_GROUP}/updates`
export const CREATE_NEW_GROUP = `${SERVER_URL}/${API_STUDY_GROUP}/create-new-group`
export const DELETE_GROUP = `${SERVER_URL}/${API_STUDY_GROUP}/delete-group-by-id`
export const UPDATE_GROUP = `${SERVER_URL}/${API_STUDY_GROUP}/update-group-by-id`

export const GROUP_UP_BY_FORM_OF_EDUCATION = `${SERVER_URL}/${API_STUDY_GROUP}/count/education-form`
export const DELETE_GROUP_BY_ADMIN = `${SERVER_URL}/${API_STUDY_GROUP}/delete/by-group-admin`
export const GET_LIST_AVERAGES = `${SERVER_URL}/${API_STUDY_GROUP}/get-unique-average-marks`
export const GET_TOTAL_EXPELLED_STUDENTS = `${SERVER_URL}/${API_STUDY_GROUP}/total-expelled-students`
export const UPDATE_GROUP_ADMIN = `${SERVER_URL}/${API_STUDY_GROUP}/update-admin`
export const GET_FILTERED_GROUPS = `${SERVER_URL}/${API_STUDY_GROUP}/filter`
export const GET_OPERATIONS = "http://localhost:8080/api/v1/import/get-all-operations"

const ADMIN_API = `api/${API_VERSION}/admin/console`
export const GET_ALL_ADMINS = `${SERVER_URL}/${ADMIN_API}/get-all`
export const REJECT_ADMIN = `${SERVER_URL}/${ADMIN_API}/reject`
export const APPROVE_ADMIN = `${SERVER_URL}/${ADMIN_API}/approve`

