const MidiPlexStates = {
    /**
     * This state is set when a fatal error has occured which will prevent the program
     * from continuing
     */
    ERROR: 'error',
    /**
     * This state is set when the program is first opened and is loading startup assets
     */
    BOOT: 'boot',
    /**
     * This state is set when the program must wait for load to complete before continuing
     */
    LOAD: 'load',
    /**
     * This state is set if boot has completed without any fatal errors
     */
    MENU: 'menu',
    /**
     * This state is set when a project is loaded and actively being edited. This is the state
     * that will be active most of the time.
     */
    EDIT: 'edit'
}

export default MidiPlexStates;