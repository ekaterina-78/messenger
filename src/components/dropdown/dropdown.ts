import './dropdown.scss';
import { MyCoolComponent } from '../../utils/template/my-cool-component';
import { MyCoolTemplate } from '../../utils/template/my-cool-template';
import { TVirtualDomNode } from '../../utils/template/my-cool-template-types';
import { IFormInput } from '../form-input-field/form-input-field';

export interface IDropdownProps extends IFormInput {
  options: Array<string>;
  htmlType: 'select';
  disabled?: boolean;
}

export class Dropdown extends MyCoolComponent<IDropdownProps, null> {
  render(): TVirtualDomNode {
    return MyCoolTemplate.createElement(
      'div',
      { key: 'dropdown', class: 'dropdown' },
      MyCoolTemplate.createElement(
        'label',
        { key: this.props.label, class: 'dropdown_label' },
        MyCoolTemplate.createTextElement(this.props.label)
      ),
      MyCoolTemplate.createElement(
        'select',
        {
          key: 'select',
          class: 'form__input_select',
          disabled: this.props.disabled ?? false,
          onChange: this.props.onChange,
        },
        ...this.props.options.map(option =>
          MyCoolTemplate.createElement(
            'option',
            { key: this.props.label },
            MyCoolTemplate.createElement(
              'option',
              { key: option },
              MyCoolTemplate.createTextElement(option)
            )
          )
        )
      )
    );
  }
}