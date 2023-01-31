import { render } from '@testing-library/preact/pure';

import Text from '../../../../../src/render/components/form-fields/Text';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

let container;


describe('Text', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createText();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-text')).to.be.true;

    expect(container.querySelector('h1')).to.exist;
    expect(container.querySelector('ul')).to.exist;
    expect(container.querySelector('li')).to.exist;
  });


  it('should render markdown', function() {

    // given
    const text = `
# h1
## h2
### h3
#### h4
##### h5
###### h6

> Blockquote

* ul li 1
* ul li 2

1. ol li 1
2. ol li 2

\`\`\`
Some Code
\`\`\`

Some _em_ **strong** [text](#text) \`code\`.

---

![Image](#)
  `.trim();

    // when
    const { container } = createText({
      field: {
        text,
        type: 'Text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql(`<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1>h1</h1><h2>h2</h2><h3>h3</h3><h4>h4</h4><h5>h5</h5><h6>h6</h6>

<blockquote>Blockquote</blockquote>

<ul><li>ul li 1</li><li>ul li 2</li></ul>

<ol><li>ol li 1</li><li>ol li 2</li></ol>

<p></p><pre class="code"><code>Some Code</code></pre><p></p>

<p>Some <em>em</em> <strong>strong</strong> <a href="#text">text</a> <code>code</code>.</p>

<p>---</p>

<p><img alt="Image" src="#"></p></div></div>
      `.trim()
    );

  });


  it('should render (no text)', function() {

    // when
    const { container } = createText({
      field: {
        type: 'text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-text')).to.be.true;

    const paragraph = container.querySelector('p');

    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.equal('');
  });


  it('should render markdown (expression)', function() {

    // given
    const content = '#foo';

    const { container } = createText({
      data: {
        content
      },
      field: {
        text: '=foo',
        type: 'text'
      },
      evaluateExpression: () => content
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1>foo</h1></div></div>');
  });


  it('should render markdown (complex expression)', function() {

    // given
    const content = [ '#foo', '###bar' ];

    const { container } = createText({
      data: {
        content
      },
      field: {
        text: '=foo',
        type: 'text'
      },
      evaluateExpression: () => content
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1>foo,###bar</h1></div></div>');
  });


  it('#create', function() {

    // assume
    expect(Text.type).to.eql('text');
    expect(Text.label).not.to.exist;
    expect(Text.keyed).to.be.false;

    // when
    const field = Text.create();

    // then
    expect(field).to.eql({
      text: '# Text'
    });

    // but when
    const customField = Text.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createText();

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - links', async function() {

      // given
      this.timeout(5000);

      const { container } = createText({
        field: {
          text: '# Text\n* Learn more about [forms](https://bpmn.io).',
          type: 'text'
        }
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - expression', async function() {

      // given
      this.timeout(5000);

      const content = '#foo';

      const { container } = createText({
        data: {
          content
        },
        field: {
          text: '=content',
          type: 'text'
        },
        evaluateExpression: () => content
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  text: '# Text\n* Hello World',
  type: 'text'
};

function createText(options = {}) {
  const {
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ]
  } = options;

  return render(WithFormContext(
    <Text
      errors={ errors }
      field={ field }
      onChange={ onChange }
      path={ path } />,
    options
  ),
  {
    container: options.container || container.querySelector('.fjs-form')
  });
}