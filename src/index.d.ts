export declare class Container {

    /**
     * Sets the alias for the provider
     * @param alias Alias o be set
     * @param provider Provider for which alias is to be set
     */
    public alias (alias: string, provider: string): void

    /**
     * Registers the provider
     * @param opts Binding options for the provider
     */
    public register (opts: IBindingOptions): void

    /**
     * @alias register()
     */
    public bind (opts: IBindingOptions): void

    /**
     * Returns whether the provider is already registered
     * @param name Name of the provider
     */
    public registered (name: string): boolean

    /**
     * Stores the instance as a provider (singleton)
     * @param provider Provider on which instance is to be stored
     * @param instance The instance to be stored
     */
    public save (provider: IProvider, instance: any): void

    /**
     * Resolves the provider
     * @param name Name to be resolved. Can be a provider or an alias
     * @param opts Optional. Options to be passed to the content during resolution
     */
    public resolve<T> (name: string, opts: Object = {}): T

    /**
     * @alias resolve()
     */
    public get<T> (name: string, opts: Object = {}): T

    /**
     * @alias resolve()
     */
    public use<T> (name: string, opts: Object = {}): T

}

export declare interface IBindingOptions {

    /**
     * Provider which is to be registered
     */
    provider: string | IProvider,
    /**
     * Content to be registered for the provider
     */
    content: ClassDecorator | function (Container, Object),
    /**
     * Will the provider have a single instance
     */
    singleton: boolean,
    /**
     * Resolution options to pass during resolution
     */
    opts: Object

}

export declare interface IProvider {

    /**
     * Alias for the provider which can be used for resolution
     */
    alias: string,
    /**
     * Name of the provider
     */
    name: string

}
