export class SelectedExtend extends window.JSONEditor.defaults.editors.select2 {
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
        if (
          this.enumSource[i].source &&
          typeof this.enumSource[i].source == 'object'
        ) {
          var src = this.jsoneditor.expandRefs(this.enumSource[i].source);
          this.enumSource[i].source = [];
          for (var j in src) {
            this.enumSource[i].source.push(src[j]);
          }
        }
      }
      /* Other, not supported */
    } else {
      throw new Error("'select' editor requires the enum property to be set.");
    }
  }
}
