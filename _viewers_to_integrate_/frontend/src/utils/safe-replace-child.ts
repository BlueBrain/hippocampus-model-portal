export function safeReplaceWith(parent: HTMLElement, root: HTMLDivElement) {
    try {
        parent.replaceWith(root)
    } catch (ex) {
        console.warn(ex)
    }
}
