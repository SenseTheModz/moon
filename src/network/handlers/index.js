class Handler {
  constructor(manager) {
    /**
     * Manager that instantiated this handler
     * @type {Manager}
     * @protected
     */
    this.manager = manager;
  }

  handle() {
    throw new Error('Method not implemented.');
  }
}

module.exports = Handler;

