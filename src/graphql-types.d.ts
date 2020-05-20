import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ObjectId: any;
};

export type DeleteManyPayload = {
  __typename?: 'DeleteManyPayload';
  deletedCount: Scalars['Int'];
};

export type InsertManyPayload = {
  __typename?: 'InsertManyPayload';
  insertedIds: Array<Maybe<Scalars['ObjectId']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteManyProjects?: Maybe<DeleteManyPayload>;
  deleteManyTasks?: Maybe<DeleteManyPayload>;
  deleteManyUsers?: Maybe<DeleteManyPayload>;
  deleteOneProject?: Maybe<Project>;
  deleteOneTask?: Maybe<Task>;
  deleteOneUser?: Maybe<User>;
  insertManyProjects?: Maybe<InsertManyPayload>;
  insertManyTasks?: Maybe<InsertManyPayload>;
  insertManyUsers?: Maybe<InsertManyPayload>;
  insertOneProject?: Maybe<Project>;
  insertOneTask?: Maybe<Task>;
  insertOneUser?: Maybe<User>;
  replaceOneProject?: Maybe<Project>;
  replaceOneTask?: Maybe<Task>;
  replaceOneUser?: Maybe<User>;
  updateManyProjects?: Maybe<UpdateManyPayload>;
  updateManyTasks?: Maybe<UpdateManyPayload>;
  updateManyUsers?: Maybe<UpdateManyPayload>;
  updateOneProject?: Maybe<Project>;
  updateOneTask?: Maybe<Task>;
  updateOneUser?: Maybe<User>;
  upsertOneProject?: Maybe<Project>;
  upsertOneTask?: Maybe<Task>;
  upsertOneUser?: Maybe<User>;
};


export type MutationDeleteManyProjectsArgs = {
  query?: Maybe<ProjectQueryInput>;
};


export type MutationDeleteManyTasksArgs = {
  query?: Maybe<TaskQueryInput>;
};


export type MutationDeleteManyUsersArgs = {
  query?: Maybe<UserQueryInput>;
};


export type MutationDeleteOneProjectArgs = {
  query: ProjectQueryInput;
};


export type MutationDeleteOneTaskArgs = {
  query: TaskQueryInput;
};


export type MutationDeleteOneUserArgs = {
  query: UserQueryInput;
};


export type MutationInsertManyProjectsArgs = {
  data: Array<ProjectInsertInput>;
};


export type MutationInsertManyTasksArgs = {
  data: Array<TaskInsertInput>;
};


export type MutationInsertManyUsersArgs = {
  data: Array<UserInsertInput>;
};


export type MutationInsertOneProjectArgs = {
  data: ProjectInsertInput;
};


export type MutationInsertOneTaskArgs = {
  data: TaskInsertInput;
};


export type MutationInsertOneUserArgs = {
  data: UserInsertInput;
};


export type MutationReplaceOneProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
  data: ProjectInsertInput;
};


export type MutationReplaceOneTaskArgs = {
  query?: Maybe<TaskQueryInput>;
  data: TaskInsertInput;
};


export type MutationReplaceOneUserArgs = {
  query?: Maybe<UserQueryInput>;
  data: UserInsertInput;
};


export type MutationUpdateManyProjectsArgs = {
  query?: Maybe<ProjectQueryInput>;
  set: ProjectUpdateInput;
};


export type MutationUpdateManyTasksArgs = {
  query?: Maybe<TaskQueryInput>;
  set: TaskUpdateInput;
};


export type MutationUpdateManyUsersArgs = {
  query?: Maybe<UserQueryInput>;
  set: UserUpdateInput;
};


export type MutationUpdateOneProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
  set: ProjectUpdateInput;
};


export type MutationUpdateOneTaskArgs = {
  query?: Maybe<TaskQueryInput>;
  set: TaskUpdateInput;
};


export type MutationUpdateOneUserArgs = {
  query?: Maybe<UserQueryInput>;
  set: UserUpdateInput;
};


export type MutationUpsertOneProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
  data: ProjectInsertInput;
};


export type MutationUpsertOneTaskArgs = {
  query?: Maybe<TaskQueryInput>;
  data: TaskInsertInput;
};


export type MutationUpsertOneUserArgs = {
  query?: Maybe<UserQueryInput>;
  data: UserInsertInput;
};


export type Project = {
  __typename?: 'Project';
  _id?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type ProjectInsertInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
  users?: Maybe<ProjectUsersRelationInput>;
};

export type ProjectQueryInput = {
  _id_lte?: Maybe<Scalars['ObjectId']>;
  _id_lt?: Maybe<Scalars['ObjectId']>;
  name_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_lte?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_ne?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<ProjectQueryInput>>;
  _id_gte?: Maybe<Scalars['ObjectId']>;
  users_exists?: Maybe<Scalars['Boolean']>;
  users_in?: Maybe<Array<Maybe<UserQueryInput>>>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  _id_nin?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  users?: Maybe<Array<Maybe<UserQueryInput>>>;
  users_nin?: Maybe<Array<Maybe<UserQueryInput>>>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_gt?: Maybe<Scalars['ObjectId']>;
  _id_exists?: Maybe<Scalars['Boolean']>;
  _id_ne?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['ObjectId']>;
  _id_in?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  OR?: Maybe<Array<ProjectQueryInput>>;
};

export enum ProjectSortByInput {
  IdDesc = '_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  IdAsc = '_ID_ASC'
}

export type ProjectUpdateInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  _id_unset?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  name_unset?: Maybe<Scalars['Boolean']>;
  users?: Maybe<ProjectUsersRelationInput>;
  users_unset?: Maybe<Scalars['Boolean']>;
};

export type ProjectUsersRelationInput = {
  create?: Maybe<Array<Maybe<UserInsertInput>>>;
  link?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects: Array<Maybe<Project>>;
  task?: Maybe<Task>;
  tasks: Array<Maybe<Task>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryProjectArgs = {
  query?: Maybe<ProjectQueryInput>;
};


export type QueryProjectsArgs = {
  query?: Maybe<ProjectQueryInput>;
  limit?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<ProjectSortByInput>;
};


export type QueryTaskArgs = {
  query?: Maybe<TaskQueryInput>;
};


export type QueryTasksArgs = {
  query?: Maybe<TaskQueryInput>;
  limit?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<TaskSortByInput>;
};


export type QueryUserArgs = {
  query?: Maybe<UserQueryInput>;
};


export type QueryUsersArgs = {
  query?: Maybe<UserQueryInput>;
  limit?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<UserSortByInput>;
};

export type Task = {
  __typename?: 'Task';
  _id?: Maybe<Scalars['ObjectId']>;
  assignee?: Maybe<User>;
  description: Scalars['String'];
  status: Scalars['String'];
};

export type TaskAssigneeRelationInput = {
  create?: Maybe<UserInsertInput>;
  link?: Maybe<Scalars['String']>;
};

export type TaskInsertInput = {
  description: Scalars['String'];
  status: Scalars['String'];
  _id?: Maybe<Scalars['ObjectId']>;
  assignee?: Maybe<TaskAssigneeRelationInput>;
};

export type TaskQueryInput = {
  description_gt?: Maybe<Scalars['String']>;
  assignee_exists?: Maybe<Scalars['Boolean']>;
  description_gte?: Maybe<Scalars['String']>;
  _id_ne?: Maybe<Scalars['ObjectId']>;
  _id_lte?: Maybe<Scalars['ObjectId']>;
  description_lt?: Maybe<Scalars['String']>;
  _id_lt?: Maybe<Scalars['ObjectId']>;
  description_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_gte?: Maybe<Scalars['ObjectId']>;
  description_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  description_lte?: Maybe<Scalars['String']>;
  status_gt?: Maybe<Scalars['String']>;
  _id_nin?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  status_lte?: Maybe<Scalars['String']>;
  OR?: Maybe<Array<TaskQueryInput>>;
  status_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_in?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  status_gte?: Maybe<Scalars['String']>;
  _id_exists?: Maybe<Scalars['Boolean']>;
  status_exists?: Maybe<Scalars['Boolean']>;
  status_ne?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<TaskQueryInput>>;
  description_ne?: Maybe<Scalars['String']>;
  description_exists?: Maybe<Scalars['Boolean']>;
  status_lt?: Maybe<Scalars['String']>;
  _id_gt?: Maybe<Scalars['ObjectId']>;
  status?: Maybe<Scalars['String']>;
  assignee?: Maybe<UserQueryInput>;
  description?: Maybe<Scalars['String']>;
  status_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id?: Maybe<Scalars['ObjectId']>;
};

export enum TaskSortByInput {
  AssigneeDesc = 'ASSIGNEE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  AssigneeAsc = 'ASSIGNEE_ASC'
}

export type TaskUpdateInput = {
  description_unset?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  status_unset?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['ObjectId']>;
  _id_unset?: Maybe<Scalars['Boolean']>;
  assignee?: Maybe<TaskAssigneeRelationInput>;
  assignee_unset?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
};

export type UpdateManyPayload = {
  __typename?: 'UpdateManyPayload';
  matchedCount: Scalars['Int'];
  modifiedCount: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ObjectId']>;
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  projects?: Maybe<Array<Maybe<Project>>>;
  user_id: Scalars['String'];
};

export type UserInsertInput = {
  user_id: Scalars['String'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  projects?: Maybe<UserProjectsRelationInput>;
  _id?: Maybe<Scalars['ObjectId']>;
};

export type UserProjectsRelationInput = {
  link?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  create?: Maybe<Array<Maybe<ProjectInsertInput>>>;
};

export type UserQueryInput = {
  user_id_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  image_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_in?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  projects?: Maybe<Array<Maybe<ProjectQueryInput>>>;
  image_gt?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  image_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_ne?: Maybe<Scalars['String']>;
  OR?: Maybe<Array<UserQueryInput>>;
  user_id_lt?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id_gt?: Maybe<Scalars['String']>;
  user_id_ne?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  _id_gt?: Maybe<Scalars['ObjectId']>;
  image_lt?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  _id_ne?: Maybe<Scalars['ObjectId']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_lte?: Maybe<Scalars['ObjectId']>;
  image_gte?: Maybe<Scalars['String']>;
  image_lte?: Maybe<Scalars['String']>;
  image_exists?: Maybe<Scalars['Boolean']>;
  _id_gte?: Maybe<Scalars['ObjectId']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  name_gt?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['ObjectId']>;
  AND?: Maybe<Array<UserQueryInput>>;
  user_id_lte?: Maybe<Scalars['String']>;
  _id_lt?: Maybe<Scalars['ObjectId']>;
  user_id_gte?: Maybe<Scalars['String']>;
  image_ne?: Maybe<Scalars['String']>;
  user_id_exists?: Maybe<Scalars['Boolean']>;
  _id_nin?: Maybe<Array<Maybe<Scalars['ObjectId']>>>;
  _id_exists?: Maybe<Scalars['Boolean']>;
  projects_exists?: Maybe<Scalars['Boolean']>;
  projects_nin?: Maybe<Array<Maybe<ProjectQueryInput>>>;
  name_gte?: Maybe<Scalars['String']>;
  projects_in?: Maybe<Array<Maybe<ProjectQueryInput>>>;
};

export enum UserSortByInput {
  ImageDesc = 'IMAGE_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  ImageAsc = 'IMAGE_ASC'
}

export type UserUpdateInput = {
  user_id?: Maybe<Scalars['String']>;
  user_id_unset?: Maybe<Scalars['Boolean']>;
  _id?: Maybe<Scalars['ObjectId']>;
  projects?: Maybe<UserProjectsRelationInput>;
  name_unset?: Maybe<Scalars['Boolean']>;
  image_unset?: Maybe<Scalars['Boolean']>;
  _id_unset?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Scalars['String']>;
  projects_unset?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
};

export type GetAllTasksQueryVariables = {};


export type GetAllTasksQuery = (
  { __typename?: 'Query' }
  & { tasks: Array<Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )>> }
);

export type AddTaskMutationVariables = {
  task: TaskInsertInput;
};


export type AddTaskMutation = (
  { __typename?: 'Mutation' }
  & { task?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )> }
);

export type UpdateTaskMutationVariables = {
  taskId: Scalars['ObjectId'];
  updates: TaskUpdateInput;
};


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { task?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )> }
);

export type DeleteTaskMutationVariables = {
  taskId: Scalars['ObjectId'];
};


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deletedTask?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, '_id' | 'description' | 'status'>
    & { assignee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'user_id'>
    )> }
  )> }
);


export const GetAllTasksDocument = gql`
    query GetAllTasks {
  tasks {
    _id
    description
    status
    assignee {
      _id
      name
      image
      user_id
    }
  }
}
    `;

/**
 * __useGetAllTasksQuery__
 *
 * To run a query within a React component, call `useGetAllTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTasksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTasksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, baseOptions);
      }
export function useGetAllTasksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, baseOptions);
        }
export type GetAllTasksQueryHookResult = ReturnType<typeof useGetAllTasksQuery>;
export type GetAllTasksLazyQueryHookResult = ReturnType<typeof useGetAllTasksLazyQuery>;
export type GetAllTasksQueryResult = ApolloReactCommon.QueryResult<GetAllTasksQuery, GetAllTasksQueryVariables>;
export const AddTaskDocument = gql`
    mutation AddTask($task: TaskInsertInput!) {
  task: insertOneTask(data: $task) {
    _id
    description
    status
    assignee {
      _id
      name
      image
      user_id
    }
  }
}
    `;
export type AddTaskMutationFn = ApolloReactCommon.MutationFunction<AddTaskMutation, AddTaskMutationVariables>;

/**
 * __useAddTaskMutation__
 *
 * To run a mutation, you first call `useAddTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTaskMutation, { data, loading, error }] = useAddTaskMutation({
 *   variables: {
 *      task: // value for 'task'
 *   },
 * });
 */
export function useAddTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddTaskMutation, AddTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<AddTaskMutation, AddTaskMutationVariables>(AddTaskDocument, baseOptions);
      }
export type AddTaskMutationHookResult = ReturnType<typeof useAddTaskMutation>;
export type AddTaskMutationResult = ApolloReactCommon.MutationResult<AddTaskMutation>;
export type AddTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<AddTaskMutation, AddTaskMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($taskId: ObjectId!, $updates: TaskUpdateInput!) {
  task: updateOneTask(query: {_id: $taskId}, set: $updates) {
    _id
    description
    status
    assignee {
      _id
      name
      image
      user_id
    }
  }
}
    `;
export type UpdateTaskMutationFn = ApolloReactCommon.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      taskId: // value for 'taskId'
 *      updates: // value for 'updates'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, baseOptions);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = ApolloReactCommon.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($taskId: ObjectId!) {
  deletedTask: deleteOneTask(query: {_id: $taskId}) {
    _id
    description
    status
    assignee {
      _id
      name
      image
      user_id
    }
  }
}
    `;
export type DeleteTaskMutationFn = ApolloReactCommon.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, baseOptions);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = ApolloReactCommon.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;