# FreelanceHub Data Dictionary

This document maps the core MongoDB collections required by the project proposal.

## Users Collection

| Field | Data Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Unique identifier |
| `name` | `String` | Full name |
| `email` | `String` | Unique user email |
| `password` | `String` | Bcrypt hashed password |
| `role` | `String` | `client` \| `freelancer` \| `admin` |
| `skills` | `Array<String>` | Freelancer skills list |
| `bio` | `String` | Short professional summary |
| `profileImage` | `String` | Cloudinary URL for profile image |
| `isActive` | `Boolean` | Active or banned state |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` | Last update timestamp |

## Jobs Collection

| Field | Data Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Unique identifier |
| `title` | `String` | Job title |
| `description` | `String` | Job details |
| `budget` | `Number` | Budget in PKR |
| `budgetUSD` | `Number` | Converted budget in USD |
| `category` | `String` | Job category |
| `skillsRequired` | `Array<String>` | Required skills |
| `clientId` | `ObjectId` | Ref to client in `Users` |
| `status` | `String` | `open` \| `in-progress` \| `closed` \| `approved` \| `rejected` \| `flagged` |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` | Last update timestamp |

## Proposals Collection

| Field | Data Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Unique identifier |
| `jobId` | `ObjectId` | Ref to `Jobs` |
| `freelancerId` | `ObjectId` | Ref to freelancer in `Users` |
| `coverLetter` | `String` | Proposal message |
| `bidAmount` | `Number` | Proposed budget in PKR |
| `status` | `String` | `pending` \| `accepted` \| `rejected` \| `withdrawn` |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` | Last update timestamp |

## Reviews Collection

| Field | Data Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Unique identifier |
| `jobId` | `ObjectId` | Ref to completed job |
| `clientId` | `ObjectId` | Ref to client |
| `freelancerId` | `ObjectId` | Ref to freelancer |
| `rating` | `Number` | Rating from 1 to 5 |
| `comment` | `String` | Feedback text |
| `createdAt` | `Date` | Creation timestamp |

## Messages Collection

| Field | Data Type | Description |
| --- | --- | --- |
| `_id` | `ObjectId` | Unique identifier |
| `conversationId` | `ObjectId` | Conversation/thread reference |
| `senderId` | `ObjectId` | Ref to sender in `Users` |
| `receiverId` | `ObjectId` | Ref to receiver in `Users` |
| `jobId` | `ObjectId` | Related job reference |
| `text` | `String` | Message content |
| `createdAt` | `Date` | Message timestamp |

## Notes

- Fields listed above align with the proposal's mandatory data dictionary.
- Some optional collections (Reviews and Messages) are documented for design completeness and can be implemented incrementally.
