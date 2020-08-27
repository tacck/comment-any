/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      active
      comments {
        items {
          id
          eventId
          comment
          likes
          name
          updatedAt
          createdAt
        }
        nextToken
      }
      createdAt
      owner
      updatedAt
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        active
        comments {
          nextToken
        }
        createdAt
        owner
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      eventId
      comment
      likes
      name
      updatedAt
      createdAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        eventId
        comment
        likes
        name
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const listCommentByEventId = /* GraphQL */ `
  query ListCommentByEventId(
    $eventId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentByEventId(
      eventId: $eventId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        eventId
        comment
        likes
        name
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
