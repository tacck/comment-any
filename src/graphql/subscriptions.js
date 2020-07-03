/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent {
    onCreateEvent {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent {
    onUpdateEvent {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent {
    onDeleteEvent {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
