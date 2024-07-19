# Job Board

## Description

The Job Board project is a modern web application designed to facilitate job postings and company information management. Built using [Nuxt.js](https://nuxtjs.org/) and [Firebase](https://firebase.google.com/), the application offers a seamless user experience for both job seekers and employers. It utilizes Firebase Authentication and Firestore for backend services.

### Key Features
- **User Authentication**: Secure sign-in and sign-out functionality using Firebase Authentication.
- **Job Management**: Users can create, read, update, and delete job postings.
- **Company Management**: Employers can manage company profiles and job listings.
- **Dynamic Forms**: Job and company details are managed through dynamically generated forms.

### Tech Stack
- **Frontend**: Nuxt.js
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Vercel (with local testing using Firebase Emulator)

### Local Development

To run this project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ekunemmanuel/job-board.git
   cd job-board
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Firebase Emulator:**

   Follow the [Firebase Emulator Suite documentation](https://firebase.google.com/docs/emulator-suite) to configure and start the emulators.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application should now be running on [http://localhost:3000](http://localhost:3000).

### API Reference

#### `fetchDocs<T>`

Fetches documents from a Firestore collection based on optional ordering and where clauses.

```typescript
async function fetchDocs<T>({
  collectionName,
  order,
  whereClauses,
}: {
  collectionName: string;
  order?: FirestoreOrderClause[];
  whereClauses?: FirestoreWhereClause[];
}): Promise<{ error: Error | null; data: T[] | null }>
```

#### `performBatchedProcesses`

Performs batched writes to Firestore. This function allows multiple create, update, and delete operations to be executed atomically.

```typescript
async function performBatchedProcesses(
  operations: BatchOperations[]
): Promise<void>
```

#### `createDoc`

Adds a document to a Firestore collection. Allows for either a custom document ID or an auto-generated ID.

```typescript
async function createDoc({
  collectionName,
  data,
  docId,
}: {
  collectionName: string;
  data: Record<string, any>;
  docId?: string;
}): Promise<string>
```

#### `removeDoc`

Deletes a document from a Firestore collection.

```typescript
async function removeDoc({
  collectionName,
  docId,
}: {
  collectionName: string;
  docId: string;
}): Promise<void>
```

#### `modifyDoc`

Updates a document in a Firestore collection, with support for array operations.

```typescript
async function modifyDoc({
  collectionName,
  docId,
  data,
  options,
}: {
  collectionName: string;
  docId: string;
  data: Record<string, any>;
  options?: ArrayOperations;
}): Promise<void>
```

#### `getDoc<T>`

Retrieves a document from a Firestore collection based on the document ID.

```typescript
async function getDoc<T>({
  collectionName,
  docId,
}: {
  collectionName: string;
  docId: string;
}): Promise<{ data: T | null; pending: boolean }>
```

## Contact

- **Name:** Emmanuel Apabiekun
- **Email:** [emmanielapabiekun@gmail.com](mailto:emmanielapabiekun@gmail.com)
- **GitHub:** [https://github.com/ekunemmanuel](https://github.com/ekunemmanuel)
- **LinkedIn:** [Emmanuel Apabiekun](https://www.linkedin.com/in/apabiekun/?lipi=urn%3Ali%3Apage%3Ad_flagship3_notifications%3BpvBsQBWITu6B01YCrsPT3w%3D%3D)