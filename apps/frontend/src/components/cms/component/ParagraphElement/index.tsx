import { CmsComponent } from "@remkoj/optimizely-cms-react";
import { ParagraphElementDataFragmentDoc, type ParagraphElementDataFragment } from "@/gql/graphql";
import { CmsEditable } from "@remkoj/optimizely-cms-react/rsc";
import { RichText, extractSettings } from "@remkoj/optimizely-cms-react/rsc";
import { factory as defaultFactory } from "@/components/factory";
import { DefaultParagraphProps } from "./displayTemplates";
import { CommentIcons } from "./CommentIcons";

enum AlignClasses {
    left = " mr-auto ml-0",
    center = " mx-auto",
    right = " ml-auto mr-0"
}

/**
 * Paragraph
 *
 */
export const ParagraphElementElement : CmsComponent<ParagraphElementDataFragment, DefaultParagraphProps> = ({ data: { text, internal_comment, external_comment }, contentLink, layoutProps, ctx }) => {
    const { factory } = ctx || { factory: defaultFactory }
    const {
        placement = "left",
        transform = "default"
    } = extractSettings(layoutProps)

    const width = transform == "full" ? ' max-w-none' : ''
    const align = AlignClasses[placement]

    const hasComments = internal_comment?.html || internal_comment?.json || external_comment?.html || external_comment?.json;

    return (
        <div className="relative">
            <CmsEditable as={RichText} ctx={ ctx } cmsFieldName="text" text={ text?.json } forwardCtx="ctx" cmsId={ contentLink.key } className={`rich-text prose${ width }${ align }`}/>
            {hasComments && (
                <CommentIcons
                    internalComment={internal_comment}
                    externalComment={external_comment}
                />
            )}
        </div>
    )
}
ParagraphElementElement.displayName = "Paragraph (Element/ParagraphElement)"
ParagraphElementElement.getDataFragment = () => ['ParagraphElementData', ParagraphElementDataFragmentDoc]

export default ParagraphElementElement
