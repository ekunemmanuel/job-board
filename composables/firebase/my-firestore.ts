import {
  collection,
  doc,
  query,
  orderBy,
  where,
  QueryConstraint,
  updateDoc,
  deleteDoc,
  addDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
  writeBatch,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { any } from "zod";
import type { BatchOperations } from "~/types";

interface FirestoreWhereClause {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}

interface FirestoreOrderClause {
  field: string;
  direction: "asc" | "desc";
}

interface ArrayOperations {
  arrayUnion?: Record<string, any>;
  arrayRemove?: Record<string, any>;
}

export const useMyFirestore = () => {
  const db = useFirestore();

  /**
   * Fetches a collection from Firestore with optional ordering and filtering.
   * This function allows for real-time updates from the Firestore collection.
   *
   * @param {string} collectionName - The name of the collection to fetch.
   * @param {FirestoreOrderClause[]} [order] - Optional ordering parameters.
   * @param {FirestoreWhereClause[]} [whereClauses] - Optional where clauses for filtering.
   * @returns The data and pending state of the collection query.
   * @example
   * // Fetches all documents from 'myCollection', ordered by 'createdAt' in descending order,
   * // where the 'status' field is equal to 'active'.
   * getCollection(
   *   "myCollection",
   *   [{ field: "createdAt", direction: "desc" }],
   *   [{ field: "status", operator: "==", value: "active" }]
   * ).then(({ data, pending }) => {
   *   if (!pending) {
   *     console.log(data);
   *   }
   * });
   */
  async function getCollection<T>({
    collectionName,
    ssrKey,
    order,
    whereClauses,
  }: {
    collectionName: string;
    ssrKey?: string;
    order?: FirestoreOrderClause[];
    whereClauses?: FirestoreWhereClause[];
  }) {
    const constraints: QueryConstraint[] = [];

    if (whereClauses) {
      whereClauses.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value));
      });
    }

    if (order) {
      order.forEach(({ field, direction }) => {
        constraints.push(orderBy(field, direction));
      });
    }

    const q = query(collection(db, collectionName), ...constraints);

    try {
      const { data, pending, promise } = useCollection<T>(q, {
        ssrKey: ssrKey,
      });
      await promise.value;
      return { data, pending };
    } catch (error) {
      console.error("Error fetching collection:", error);
      throw error;
    }
  }

  /**
   * Retrieves a document from a Firestore collection based on the document ID.
   *
   * @param {string} collectionName - The name of the Firestore collection to query.
   * @param {string} docId - The unique identifier of the document to retrieve.
   * @returns {Promise<{data: any, pending: boolean}>} A promise that resolves with the document data and a pending state.
   */
  async function getDoc<T>({
    collectionName,
    docId,
  }: {
    collectionName: string;
    docId: string;
  }) {
    try {
      const docRef = doc(db, collectionName, docId);
      const { data, pending, promise } = useDocument(docRef);
      await promise.value;
      return { data: data.value as T, pending };
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error;
    }
  }

  /**
   * Updates a document in a Firestore collection, with support for array operations.
   *
   * @param {string} collectionName - The name of the Firestore collection.
   * @param {string} docId - The ID of the document to update.
   * @param {Object} data - The data to update in the document.
   * @param {ArrayOperations} [options] - Optional parameters for array operations.
   * @returns {Promise<void>} A promise that resolves when the document is successfully updated.
   */
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
  }): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      const updateData = { ...data };

      if (options) {
        if (options.arrayUnion) {
          Object.keys(options.arrayUnion).forEach((key) => {
            updateData[key] = arrayUnion(options.arrayUnion![key]);
          });
        }
        if (options.arrayRemove) {
          Object.keys(options.arrayRemove).forEach((key) => {
            updateData[key] = arrayRemove(options.arrayRemove![key]);
          });
        }
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  /**
   * Deletes a document from a Firestore collection.
   *
   * @param {string} collectionName - The name of the Firestore collection.
   * @param {string} docId - The ID of the document to delete.
   * @returns {Promise<void>} A promise that resolves when the document is successfully deleted.
   */
  async function removeDoc({
    collectionName,
    docId,
  }: {
    collectionName: string;
    docId: string;
  }): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  /**
   * Adds a document to a Firestore collection. Allows for either a custom document ID or an auto-generated ID.
   *
   * @param {string} collectionName - The name of the Firestore collection.
   * @param {Object} data - The data to be added to the document.
   * @param {string} [docId] - Optional. The custom ID to use for the new document.
   * @returns {Promise<string>} A promise that resolves with the ID of the added document.
   */
  async function createDoc({
    collectionName,
    data,
    docId,
  }: {
    collectionName: string;
    data: Record<string, any>;
    docId?: string;
  }): Promise<string> {
    try {
      if (docId) {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data);
        return docId;
      } else {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, data);
        return docRef.id;
      }
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  /**
   * Performs batched writes to Firestore. This function allows multiple create, update, and delete operations to be executed atomically.
   *
   * @param {Firestore} db - The Firestore database instance.
   * @param {Array} operations - An array of operations to be performed in the batch. Each operation is an object that includes:
   *   - `type`: The operation type ('set', 'update', or 'delete').
   *   - `collection`: The name of the collection.
   *   - `docId`: The ID of the document to operate on.
   *   - `data`: The data for 'set' or 'update' operations. Not needed for 'delete'.
   * @example
   * performBatchedWrites(db, [
   *   { type: 'set', collection: 'users', docId: 'user1', data: { name: 'John Doe', email: 'john@example.com' } },
   *   { type: 'update', collection: 'users', docId: 'user2', data: { email: 'jane@newexample.com' } },
   *   { type: 'delete', collection: 'users', docId: 'user3' }
   * ]);
   *
   * @returns {Promise<void>} A promise that resolves when all operations in the batch have been successfully executed.
   */
  async function performBatchedProcesses(
    operations: BatchOperations[]
  ): Promise<void> {
    const batch = writeBatch(db);
    // Iterate through each operation and add it to the batch
    operations.forEach(({ type, collection, docId, data }) => {
      const docRef = doc(db, collection, docId);

      // Determine the type of operation and apply it to the batch
      switch (type) {
        case "set":
          batch.set(docRef, data);
          break;
        case "update":
          batch.update(docRef, data);
          break;
        case "delete":
          batch.delete(docRef);
          break;
        default:
          throw new Error(`Unsupported operation type: ${type}`);
      }
    });

    // Commit the batch and wait for it to complete
    await batch.commit();
  }

  /**
   * Fetches documents from a Firestore collection based on optional ordering and where clauses.
   * @param params - Parameters for fetching documents.
   * @param params.collectionName - The name of the Firestore collection.
   * @param params.order - Optional ordering clauses.
   * @param params.whereClauses - Optional where clauses for filtering documents.
   * @returns An object containing either the fetched data or an error.
   */
  async function fetchDocs<T>({
    collectionName,
    order,
    whereClauses,
  }: {
    collectionName: string;
    order?: FirestoreOrderClause[];
    whereClauses?: FirestoreWhereClause[];
  }) {
    // }): Promise<{ data: T[] | null; error: Error | null }> {
    const constraints: QueryConstraint[] = [];

    if (whereClauses) {
      whereClauses.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value));
      });
    }

    if (order) {
      order.forEach(({ field, direction }) => {
        constraints.push(orderBy(field, direction));
      });
    }

    const q = query(collection(db, collectionName), ...constraints);

    try {
      // Execute the query
      const querySnapshot = await getDocs(q);

      // Map query results to an array of data
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return documents as T[];
      // return { data: documents as T[], error: null };
    } catch (error) {
      console.error("Error fetching collection:", error);
      throw error;
      // return { data: null, error: new Error("Failed to fetch documents from the collection") };
    }
  }
  return {
    getCollection,
    getDoc,
    modifyDoc,
    removeDoc,
    createDoc,
    fetchDocs,
    performBatchedProcesses,
  };
};
