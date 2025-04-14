import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  DocumentData, 
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../firebase';

export const useFirestore = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get all documents from a collection
  const getCollection = async (collectionName: string) => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a single document by ID
  const getDocument = async (collectionName: string, documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new document to a collection
  const addDocument = async (collectionName: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing document
  const updateDocument = async (collectionName: string, documentId: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (collectionName: string, documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Query documents with filters
  const queryDocuments = async (collectionName: string, constraints: QueryConstraint[]) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    getCollection,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    queryDocuments
  };
}; 