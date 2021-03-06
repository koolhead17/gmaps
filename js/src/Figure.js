
import _ from 'underscore';

import widgets from 'jupyter-js-widgets';

export class FigureModel extends widgets.VBoxModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: "FigureModel",
            _view_name: "FigureView",
            _model_module: "jupyter-gmaps",
            _view_module: "jupyter-gmaps",
            children: [],
            box_style: '',
            _map: undefined,
            _errors_box: undefined,
            _toolbar: undefined
        }
    }

    static serializers = {
        ...widgets.DOMWidgetModel.serializers,
        children: {deserialize: widgets.unpack_models},
        _map: {deserialize: widgets.unpack_models},
        _toolbar: {deserialize: widgets.unpack_models},
        _errors_box: {deserialize: widgets.unpack_models}
    }
}

export class FigureView extends widgets.VBoxView {
    initialize(parameters) {
        super.initialize(parameters)
        const toolbarModel = this.model.get("_toolbar");
        if(toolbarModel) {
            this.toolbarView =
                this.add_child_model(this.model.get("_toolbar"))
                    .then(toolbarView => {
                        toolbarView.registerSavePngCallback(
                            () => this.savePng()
                        )
                        return toolbarView;
                    })
        }
        else {
            this.toolbarView = null;
        }
        const errorsBoxModel = this.model.get('_errors_box');
        if (errorsBoxModel) {
            this.errorsBoxView =
                this.add_child_model(this.model.get("_errors_box"));
        }
        this.mapView = this.add_child_model(this.model.get("_map"));
    }

    savePng() {
        return this.mapView.then(view =>
            view.savePng().catch(e => this.addError(e))
        );
    }

    addError(errorMessage) {
        console.log(`[Error]: ${errorMessage}`)
        const errorsBoxModel = this.model.get("_errors_box")
        if (errorsBoxModel) {
            errorsBoxModel.addError(errorMessage);
        }
    }
}
