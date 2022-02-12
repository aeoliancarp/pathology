// represents a document from the psychopath.universes collection
export default interface PsychopathUniverse {
  _id: string;
  email: string | undefined;
  hasWorld: boolean;
  inPathology: boolean; // NB: computed field
  name: string;
  psychopathId: number;
}
