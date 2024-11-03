export const SERVER_URL = 'http://localhost:8080'
export const LOGIN = 'api/user/login'
export const CREATE_USER = "api/user/create-user"

const API_PERSON = "api/person"
export const GET_PERSONS = `${SERVER_URL}/${API_PERSON}/persons-names`
export const CREATE_PERSON = `${SERVER_URL}/${API_PERSON}/create-person`
export const DELETE_PERSON = `${SERVER_URL}/${API_PERSON}/delete-person-by-id`
export const UPDATE_PERSON = `${SERVER_URL}/${API_PERSON}/update-person`

const API_STUDY_GROUP = "api/study-group"
export const GET_ALL_GROUPS = `${SERVER_URL}/${API_STUDY_GROUP}/get-all-groups`
export const CREATE_NEW_GROUP = `${SERVER_URL}/${API_STUDY_GROUP}/create-new-group`
export const DELETE_GROUP = `${SERVER_URL}/${API_STUDY_GROUP}/delete-group-by-id`

export const REQUEST_ADMIN = "request_admin"