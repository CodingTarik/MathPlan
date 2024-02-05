/**
 * @description Represents an extension of the Select2 editor with additional $ref loading functionality for enumSource.
 * @extends window.JSONEditor.defaults.editors.select2
 * @see {@link https://github.com/json-editor/json-editor/blob/b846b41697039134ac48b0078cd7056ea5d15faa/src/editors/select2.js, https://github.com/json-editor/json-editor/blob/164d6a3d2445ad0be93101e9c78fca1c6d25d6de/src/editors/select.js#L4}
 */
export class SelectedExtend extends window.JSONEditor.defaults.editors.select2 {
  afterInputReady() {
    this.select2_instance = window.jQuery(this.input).select2(null);
    this.select2v4 = null; //hasOwnProperty(this.select2_instance.select2, 'amd');

    this.selectChangeHandler = () => {
      const value = this.select2v4
        ? this.select2_instance.val()
        : this.select2_instance.select2('val');
      this.updateValue(value);
      this.onChange(true);
    };

    this.select2_instance.on('change', this.selectChangeHandler);
    this.select2_instance.on('select2-blur', this.selectChangeHandler);
  }
  onChange(bubble) {
    this.notify();
    if (this.watch_listener) this.watch_listener();
    if (bubble) this.change();
  }
  setValue(value, initial) {
    if (this.select2_instance) {
      if (initial) this.is_dirty = false;
      else if (this.jsoneditor.options.show_errors === 'change')
        this.is_dirty = true;

      const sanitized =
        this.updateValue(value); /* Sets this.value to sanitized value */

      this.input.value = sanitized;

      if (this.select2v4)
        this.select2_instance.val(sanitized).trigger('change');
      else this.select2_instance.select2('val', sanitized);

      this.onChange(true);
    } else super.setValue(value, initial);
  }
  onWatchedFieldChange() {
    let vars;
    let j;
    let selectOptions = [];
    let selectTitles = [];

    /* If this editor uses a dynamic select box */
    if (this.enumSource) {
      vars = this.getWatchedFieldValues();

      for (let i = 0; i < this.enumSource.length; i++) {
        /* Constant values */
        if (Array.isArray(this.enumSource[i])) {
          selectOptions = selectOptions.concat(this.enumSource[i]);
          selectTitles = selectTitles.concat(this.enumSource[i]);
        } else {
          let items = [];
          /* Static list of items */
          if (Array.isArray(this.enumSource[i].source)) {
            items = this.enumSource[i].source;
            /* A watched field */
          } else {
            items = vars[this.enumSource[i].source];
          }

          if (items) {
            /* Only use a predefined part of the array */
            if (this.enumSource[i].slice) {
              items = Array.prototype.slice.apply(
                items,
                this.enumSource[i].slice
              );
            }
            /* Filter the items */
            if (this.enumSource[i].filter) {
              const newItems = [];
              for (j = 0; j < items.length; j++) {
                if (
                  this.enumSource[i].filter({
                    i: j,
                    item: items[j],
                    watched: vars
                  })
                )
                  newItems.push(items[j]);
              }
              items = newItems;
            }

            const itemTitles = [];
            const itemValues = [];
            for (j = 0; j < items.length; j++) {
              const item = items[j];

              /* Rendered value */
              if (this.enumSource[i].value) {
                itemValues[j] = this.typecast(
                  this.enumSource[i].value({
                    i: j,
                    item
                  })
                );
                /* Use value directly */
              } else {
                itemValues[j] = items[j];
              }

              /* Rendered title */
              if (this.enumSource[i].title) {
                itemTitles[j] = this.enumSource[i].title({
                  i: j,
                  item
                });
                /* Use value as the title also */
              } else {
                itemTitles[j] = itemValues[j];
              }
            }

            if (this.enumSource[i].sort) {
              ((itemValues, itemTitles, order) => {
                itemValues
                  .map((v, i) => ({
                    v,
                    t: itemTitles[i]
                  }))
                  .sort((a, b) =>
                    a.v < b.v ? -order : a.v === b.v ? 0 : order
                  )
                  .forEach((v, i) => {
                    itemValues[i] = v.v;
                    itemTitles[i] = v.t;
                  });
              }).bind(
                null,
                itemValues,
                itemTitles,
                this.enumSource[i].sort === 'desc' ? 1 : -1
              )();
            }

            selectOptions = selectOptions.concat(itemValues);
            selectTitles = selectTitles.concat(itemTitles);
          }
        }
      }

      const prevValue = this.value;
      super.onWatchedFieldChange();
      // stringify selectOption values
      let selectOptionsString = [];
      for (let i = 0; i < selectOptions.length; i++) {
        selectOptionsString.push(JSON.stringify(selectOptions[i]));
      }
      this.theme.setSelectOptions(
        this.input,
        selectOptionsString,
        selectTitles
      );
      this.enum_options = selectOptionsString;
      this.enum_display = selectTitles;
      this.enum_values = selectOptions;

      /* If the previous value is still in the new select options */
      /* or if global option "enum_source_value_auto_select" is true, stick with it */
      if (
        selectOptions.includes(prevValue) ||
        this.jsoneditor.options.enum_source_value_auto_select !== false
      ) {
        this.input.value = JSON.stringify(prevValue);
        this.value = prevValue;
        /* Otherwise, set the value to the first select option */
      } else {
        this.input.value = selectOptionsString[0];
        this.value = this.typecast(selectOptions[0] || '');
        if (this.parent && !this.watchLoop)
          this.parent.onChildEditorChange(this);
        else this.jsoneditor.onChange();
        this.jsoneditor.notifyWatchers(this.path);
      }
    }
  }

  typecast(value) {
    if (this.schema.type === 'boolean')
      return value === 'undefined' || value === undefined ? undefined : !!value;
    else if (this.schema.type === 'number') return 1 * value || 0;
    else if (this.schema.type === 'integer') return Math.floor(value * 1 || 0);
    else if (this.schema.enum && value === undefined) return undefined;
    /* Begin change to not convert this to string automatically */
    return value;
    /* End change */
  }
  updateValue(value) {
    /* Change begins here */
    // dont use first value
    let sanitized = value;
    /* Change ends here */
    value = this.typecast(value || '');
    if (!this.enum_values.includes(value)) {
      if (this.newEnumAllowed) {
        sanitized = this.addNewOption(value) ? value : sanitized;
      }
    } else sanitized = value;
    // convert JSON-String to object
    this.input.value = sanitized;
    this.value = JSON.parse(sanitized);
    return this.value;
  }

  preBuild() {
    this.input_type = 'select';
    this.enum_options = [];
    this.enum_values = [];
    this.enum_display = [];
    let i;
    let callback;

    /* Enum options enumerated */
    if (this.schema.enum) {
      const display =
        (this.schema.options && this.schema.options.enum_titles) || [];

      this.schema.enum.forEach((option, i) => {
        this.enum_options[i] = `${option}`;
        this.enum_display[i] = `${
          this.translateProperty(display[i]) || option
        }`;
        this.enum_values[i] = this.typecast(option);
      });
      /* Boolean */
    } else if (this.schema.type === 'boolean') {
      this.enum_display = (this.schema.options &&
        this.schema.options.enum_titles) || ['true', 'false'];
      this.enum_options = ['1', ''];
      this.enum_values = [true, false];

      if (!this.isRequired()) {
        this.enum_display.unshift(' ');
        this.enum_options.unshift('undefined');
        this.enum_values.unshift(undefined);
      }
      /* Dynamic Enum */
    } else if (this.schema.enumSource) {
      this.enumSource = [];
      this.enum_display = [];
      this.enum_options = [];
      this.enum_values = [];

      /* Shortcut declaration for using a single array */
      if (!Array.isArray(this.schema.enumSource)) {
        if (this.schema.enumValue) {
          this.enumSource = [
            {
              source: this.schema.enumSource,
              value: this.schema.enumValue
            }
          ];
        } else {
          this.enumSource = [
            {
              source: this.schema.enumSource
            }
          ];
        }
      } else {
        for (i = 0; i < this.schema.enumSource.length; i++) {
          /* Shorthand for watched variable */
          if (typeof this.schema.enumSource[i] === 'string') {
            this.enumSource[i] = {
              source: this.schema.enumSource[i]
            };
            /* Make a copy of the schema */
          } else if (!Array.isArray(this.schema.enumSource[i])) {
            // extend ist definiert in der externen Bibliothek von JSONEditor
            /* eslint-disable-next-line no-undef */
            this.enumSource[i] = extend({}, this.schema.enumSource[i]);
          } else {
            this.enumSource[i] = this.schema.enumSource[i];
          }
        }
      }
      /* Now, enumSource is an array of sources */
      /* Walk through this array and fix up the values */
      for (i = 0; i < this.enumSource.length; i++) {
        if (this.enumSource[i].value) {
          callback = this.expandCallbacks('template', {
            template: this.enumSource[i].value
          });
          if (typeof callback.template === 'function')
            this.enumSource[i].value = callback.template;
          else
            this.enumSource[i].value = this.jsoneditor.compileTemplate(
              this.enumSource[i].value,
              this.template_engine
            );
        }
        if (this.enumSource[i].title) {
          callback = this.expandCallbacks('template', {
            template: this.enumSource[i].title
          });
          if (typeof callback.template === 'function')
            this.enumSource[i].title = callback.template;
          else
            this.enumSource[i].title = this.jsoneditor.compileTemplate(
              this.enumSource[i].title,
              this.template_engine
            );
        }
        if (this.enumSource[i].filter && this.enumSource[i].value) {
          callback = this.expandCallbacks('template', {
            template: this.enumSource[i].filter
          });
          if (typeof callback.template === 'function')
            this.enumSource[i].filter = callback.template;
          else
            this.enumSource[i].filter = this.jsoneditor.compileTemplate(
              this.enumSource[i].filter,
              this.template_engine
            );
        }
        /* Extension begins here */
        if (
          this.enumSource[i].source &&
          typeof this.enumSource[i].source == 'object'
        ) {
          var src = this.jsoneditor.expandRefs(this.enumSource[i].source);
          this.enumSource[i].source = [];
          for (var j in src) {
            // if j is not title or value
            if (j != 'title' && j != 'value')
              this.enumSource[i].source.push(src[j]);
            if (j == 'title')
              this.enumSource[i].title = (item) => {
                return item.item[src.title];
              };
          }
          this.enumSource[i].value = (item) => {
            return item.item;
          };
        }
        /* End of extension */
      }
      /* Other, not supported */
    } else {
      throw new Error("'select' editor requires the enum property to be set.");
    }
  }
}
