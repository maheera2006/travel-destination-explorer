/**
 * Trip Repository Base Contract
 * Defines the persistence abstraction contract for trip management.
 * In production guest mode, this is implemented by LocalTripRepository.
 */

export class TripRepository {
  /**
   * Retrieves all saved trips.
   * @returns {Promise<Array>} Array of validated trip objects.
   */
  async getAll() {
    throw new Error('TripRepository.getAll() must be implemented by subclass.');
  }

  /**
   * Finds a saved trip by its destination ID.
   * @param {string} destinationId
   * @returns {Promise<Object|null>}
   */
  async getByDestinationId(destinationId) {
    throw new Error('TripRepository.getByDestinationId() must be implemented by subclass.');
  }

  /**
   * Saves or updates a trip in storage.
   * @param {Object} trip
   * @returns {Promise<{success: boolean, trip?: Object, error?: string}>}
   */
  async save(trip) {
    throw new Error('TripRepository.save() must be implemented by subclass.');
  }

  /**
   * Removes a saved trip by destination ID.
   * @param {string} destinationId
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async delete(destinationId) {
    throw new Error('TripRepository.delete() must be implemented by subclass.');
  }

  /**
   * Updates partial fields of a saved trip (e.g., custom notes or days).
   * @param {string} destinationId
   * @param {Object} updates
   * @returns {Promise<{success: boolean, trip?: Object, error?: string}>}
   */
  async update(destinationId, updates) {
    throw new Error('TripRepository.update() must be implemented by subclass.');
  }

  /**
   * Exports the storage state to a JSON string.
   * @returns {string}
   */
  exportJSON() {
    throw new Error('TripRepository.exportJSON() must be implemented by subclass.');
  }

  /**
   * Imports trips from JSON with a merge or replace strategy.
   * @param {string|Object} payload
   * @param {'merge'|'replace'} strategy
   * @returns {Promise<{success: boolean, importedCount: number, error?: string}>}
   */
  async importData(payload, strategy) {
    throw new Error('TripRepository.importData() must be implemented by subclass.');
  }
}
